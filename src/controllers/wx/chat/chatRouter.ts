import { Router } from 'express';
import { verifyToken } from '../../../utils/jwt';
import { validateBody } from '../../../utils/validation.middleware';
import { CreateSessionDto,DeleteSessionDto } from './chatInterface';
import { createSession,querySessionList,deleteSession,getMessageList } from './chatController';

/** 会话、聊天路由 */
const chatRouter = Router();

//创建会话记录
chatRouter.post('/createSession', verifyToken,validateBody(CreateSessionDto), createSession)

//查询会话记录
chatRouter.get('/querySession', verifyToken, querySessionList);

//删除会话记录
chatRouter.post('/deleteSession', verifyToken,validateBody(DeleteSessionDto), deleteSession)

//获取聊天记录
chatRouter.get('/getChatMessage',verifyToken,getMessageList)

export default chatRouter;