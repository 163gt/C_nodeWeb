import { Request, Response } from 'express';
// import { v4 as uuidv4 } from "uuid"; // 用于生成唯一会话id
// import axios from 'axios';
import { hunyuan } from "tencentcloud-sdk-nodejs-hunyuan"
import { createSessionInternal } from '../chat/chatController'
import { AppDataSource } from '../../../config/database';
import { ChatMessage } from '../../../entity/entities/ChatMessage';

// import { SSEResponseModel } from 'tencentcloud-sdk-nodejs-common/tencentcloud/common/sse_response_model' //流式请求需要

/**
 * 非流式模型请求
 * @param req 
 * @param res 
 */
export const nonCurrentFlow = async (req: Request, res: Response) => {
    const { model, content, sessionId: incomingSessionId } = req.body;
    const userId = (req as any).user.userId;
    const HunyuanClient = hunyuan.v20230901.Client
    const client = new HunyuanClient({
        credential: {
            secretId: process.env.TENCENTCLOUD_HUNYUAN_SECRET_ID,
            secretKey: process.env.TENCENTCLOUD_HUNYUAN_SECRET_KEY
        },
        region: 'hunyuan-lite',
        profile: {
            httpProfile: {
                endpoint: "hunyuan.tencentcloudapi.com"
            }
        }
    })

    let response: any;  // 👈 catch 里才能访问
    let parsedContent: any;
    try {

        //创建新会话（如果没有传 sessionId）
        let sessionId = incomingSessionId;
        if (!sessionId) {
            const session = await createSessionInternal(userId, model,content);
            sessionId = session.sessionId;
        }else{
            // 如果传入了 sessionId，更新会话名称
            
        }

        //调用 HunYuan 接口
        response = await client.ChatCompletions({
            Model: model,
            Messages: [
                {
                    Role: "system",
                    Content: `
                    你是一个故事生成助手，请严格按照以下规则输出内容：
                    1. 输出是数组，每个元素是对象，对象包含两个字段：- \"title\"：标题- \"content\"：正文\n。 
                    2. 输出的数组中，对象的数量必须与请求中指定的数量一致。
                    3. 输出的数组中，每个对象中的content字段内容长度，必须根据请求中指定的字数保持相当，允许上下50字差别。
                    `
                },
                { Role: 'user', Content: content }
            ],
            Stream: false,//流式开关
            EnableDeepSearch:true,//是否开启深度研究
        });

        // 解析响应，先清洗 ```json 包裹
        if (
            response?.Choices?.[0]?.Message?.Content &&
            typeof response.Choices[0].Message.Content === 'string'
        ) {
            let contentStr = response.Choices[0].Message.Content;
            // 去掉 ```json 或 ``` 包裹
            contentStr = contentStr.replace(/^```json\s*/, '').replace(/```$/, '');
            try {
                parsedContent = JSON.parse(contentStr);
            } catch (e) {
                console.error("AI 返回内容解析失败:", contentStr);
                throw new Error("AI 响应 JSON 解析失败");
            }
        } else {
            throw new Error("Invalid response format");
        }

        // 查询当前会话最大 messageId
        const ChatMessageRepository = AppDataSource.getRepository(ChatMessage);
        const { maxMessageId }: any = await ChatMessageRepository
            .createQueryBuilder('msg')
            .select('MAX(msg.messageId)', 'maxMessageId')
            .where('msg.sessionId = :sessionId', { sessionId })
            .getRawOne();

        let nextMessageId = (Number(maxMessageId) || 0) + 1;
        let userNextMessageId = String(nextMessageId);
        let assistantNextMessageId = String(nextMessageId + 1);
        // 用户消息
        await ChatMessageRepository.save(
            ChatMessageRepository.create({
                sessionId,
                messageId: userNextMessageId,
                role: 'user',
                content: [content]
            })
        );

        // ai消息
        await ChatMessageRepository.save(
            ChatMessageRepository.create({
                sessionId,
                messageId: assistantNextMessageId,
                role: 'assistant',
                content: parsedContent
            })
        );

        res.status(200).json({ data: { Role: 'assistant', Content: parsedContent } })
    } catch (e: any) {
        console.error("内容解析失败:", e);
        res.status(500).json({
            message: "抱歉我没能理解你的需求~",
            detail: e?.message || "未知错误",
            raw: response ? JSON.stringify(response, null, 2).slice(0, 1000) : null
        });
    }
}