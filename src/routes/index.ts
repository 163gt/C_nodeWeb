import { Router } from 'express';
//微信
import userRouter from '../controllers/wx/user/userRouter';
import hunyuanRouter from '../controllers/wx/hunyuanModel/hunyuanRouter';
import chatRouter from '../controllers/wx/chat/chatRouter';
const router = Router();

/**
 * 微信
 */
//用户
router.use(userRouter);
//混元模型
router.use(hunyuanRouter);
//会话、聊天
router.use(chatRouter);

export default router;





