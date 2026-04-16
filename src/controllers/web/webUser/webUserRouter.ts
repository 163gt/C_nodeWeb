import { Router } from 'express';
import { verifyToken } from '../../../utils/jwt';
import { validateBody } from '../../../utils/validation.middleware';
import { webLoginDto } from './webUserInterface';
import { webLogin, webCreate, refUserToken, getUserList, deleteUser, webUserUpdate } from './webUserController';

/**
 * 用户路由
 */
const webUserRouter = Router();

//创建用户
webUserRouter.post('/webCreate', verifyToken, validateBody(webLoginDto), webCreate);

//修改用户
webUserRouter.post('/webUserUpdate', verifyToken, validateBody(webLoginDto), webUserUpdate);

//用户登录
webUserRouter.post('/webLogin', validateBody(webLoginDto), webLogin);

//查询用户列表
webUserRouter.get('/getUserList', verifyToken, getUserList)

//刷新token
webUserRouter.post('/refreshToken', refUserToken)

//删除用户（改为 DELETE 请求）
webUserRouter.delete('/:userId', verifyToken, deleteUser)

export default webUserRouter;