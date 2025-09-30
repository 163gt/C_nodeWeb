import { IsString, IsNotEmpty, Length } from 'class-validator';

/**
 * 创建会话 DTO
 */
export class CreateSessionDto {
    @IsString({ message: 'Model 必须是字符串' })
    @IsNotEmpty({ message: 'Model 不能为空' })
    model: string;
}
/**
 * 删除会话 DTO
 */
export class DeleteSessionDto {
    @IsString({ message: 'SessionId 必须是字符串' })
    @IsNotEmpty({ message: 'SessionId 不能为空' })
    sessionId: string;
}

/**
 * 获取聊天记录 DTO
 */
export class GetMessageDto {
    @IsString({ message: 'SessionId 必须是字符串' })
    @IsNotEmpty({ message: 'SessionId 不能为空' })
    sessionId: string;
}

