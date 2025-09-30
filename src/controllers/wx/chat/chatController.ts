import { Request, Response } from 'express';
import { v4 as uuidv4 } from "uuid"; // 用于生成唯一会话id
// import axios from 'axios';
import { ChatSession } from '../../../entity/entities/ChatSession';
import { ChatMessage } from '../../../entity/entities/ChatMessage';
import { AppDataSource } from '../../../config/database';
import { Not } from "typeorm";

/**
 * 创建会话
 * @param req 
 * @param res 
 */
export const createSession = async (req: Request, res: Response) => {
    try {
        const { model } = req.body;
        const userId = (req as any).user.userId; // 根据 JWT 结构调整字段名

        const session = await createSessionInternal(userId, model);
        // 返回结果
        res.status(201).json({
            message: '会话创建成功',
            data: session
        });
    } catch (error) {
        res.status(500).json({
            message: '会话创建失败',
            error: error
        });
    }
}
// 内部方法，用于复用
export const createSessionInternal = async (userId: string, model?: string, sessionName?: string) => {
    const ChatSessionRepository = AppDataSource.getRepository(ChatSession);
    //生成会话 ID
    const sessionId = uuidv4().replace(/-/g, '').slice(0, 16); // 16位随机字符串
    // 处理默认值
    const finalSessionName = sessionName?.trim() || '新会话';
    const finalModel = model?.trim() || 'hunyuan-lite';
    // 创建一个新的会话实体
    const newSession = ChatSessionRepository.create({
        sessionId,      // 16位随机会话ID
        userId,         // 当前用户ID
        sessionName: finalSessionName,// 会话名称
        model: finalModel,// 模型名称

    });
    await ChatSessionRepository.save(newSession);
    return { sessionId, sessionName: finalSessionName, model: finalModel };
};

/**
 * 查询会话列表
 * @param req 
 * @param res 
 */
export const querySessionList = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const ChatSessionRepository = AppDataSource.getRepository(ChatSession);
        const sessions = await ChatSessionRepository.find({
            where: { userId, status: Not(2) },
            order: { createTime: 'DESC' }
        });
        res.status(200).json({
            message: '会话列表查询成功',
            data: sessions
        });
    } catch (error) {
        res.status(500).json({
            message: '会话列表查询失败',
            error: error
        });
    }
};

/**
 * 删除会话信息
 * @param req 
 * @param res 
 */
export const deleteSession = async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.body;
        const userId = (req as any).user.userId;
        // 获取会话仓库
        const sessionRepo = AppDataSource.getRepository(ChatSession);
        await sessionRepo.delete({ userId, sessionId });
        // 查找会话，确认属于当前用户
        const session = await sessionRepo.findOne({
            where: { sessionId: sessionId, userId }
        });
        if (!session) {
            return res.status(200).json({ message: "会话不存在" });
        }
        // 软删除：更新 status 为 2
        session.status = 2;
        await sessionRepo.save(session);
        res.status(200).json({
            message: '会话删除成功',
        });
    } catch (error) {
        res.status(500).json({
            message: '会话删除失败',
            error: error
        });
    }
};

/**
 * 获取聊天记录列表
 * @param req 
 * @param res 
 */
export const getMessageList = async (req: Request, res: Response) => {
    const { sessionId } = req.query;
    try {
        let sessionIdStr = String(sessionId);
        if (!sessionIdStr) {
            return res.status(400).json({ message: 'sessionId 参数缺失' });
        }
        const MessageRepo = AppDataSource.getRepository(ChatMessage);
        const messagesList = await MessageRepo.find({
            where: { sessionId: sessionIdStr },
            order: { messageId: 'ASC' }
        });
        // 数据清洗
        const processedMessages = messagesList.map(msg => {
            let content: any = msg.content;
            if (msg.role === 'user') {
                const raw = (msg.content as string[])[0];
                content = raw;  // 类型就正常了
            }
            return {
                messageId: msg.messageId,
                sessionId: msg.sessionId,
                role: msg.role,
                content, // 这里可以是 string / object，随你定义
                createTime: msg.createTime,
            }
        });
        res.status(200).json({
            message: '聊天记录获取成功',
            data: processedMessages
        });
    } catch (error) {
        console.log(error, 'err');

        res.status(500).json({
            message: '聊天记录获取失败',
            error: error
        });
    }
}