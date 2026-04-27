import { Router } from 'express';
//微信
import userRouter from '../controllers/wx/user/userRouter';
import hunyuanRouter from '../controllers/wx/hunyuanModel/hunyuanRouter';
import chatRouter from '../controllers/wx/chat/chatRouter';
import badgeRouter from '../controllers/wx/badge/badgeRouter';
import contentRouter from '../controllers/wx/content/contentRouter';
import testRouter from '../controllers/wx/test/testRouter';
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
//徽章
router.use('/badge', badgeRouter);
//内容
router.use('/content', contentRouter);
//缘分测试
router.use('/test', testRouter);

export default router;





