import { Router } from 'express';
import { verifyToken } from '../../../utils/jwt';
import { validateBody } from '../../../utils/validation.middleware';
import { WxLoginDto } from './userInterface'; // 引入接口定义
import { getUsers, wxLogin,getUserinfo } from './userController';

/**
 * 用户路由
 */
const userRouter = Router();

//用户登录
userRouter.post('/wxLogin', validateBody(WxLoginDto), wxLogin)

//查询所有用户信息
userRouter.get('/allAserList', verifyToken, getUsers);

//查询单个用户信息
userRouter.get('/userinfo', verifyToken, getUserinfo);

export default userRouter;