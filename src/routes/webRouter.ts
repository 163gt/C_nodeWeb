import { Router } from 'express';
//后台
import webUserRouter from '../controllers/web/webUser/webUserRouter';
import webRouters from '../controllers/web/webRouters/webRouters';
import webRoleRouters from '../controllers/web/webRole/webRoleRouter';
import DictionaryRouters from '../controllers/web/webDictionary/webDictionaryRouter';
const webRouter = Router();

// 添加请求日志中间件
// webRouter.use((req, res, next) => {
//     console.log(`🌐 Web路由请求: ${req.method} ${req.originalUrl}`);
//     next();
// });

//web用户
webRouter.use(webUserRouter);
//web菜单
webRouter.use(webRouters);
//web角色
webRouter.use(webRoleRouters);
//web字典
webRouter.use(DictionaryRouters);


// // 调试：记录未匹配的请求
// webRouter.use((req, res, next) => {
//     console.log(`❌ Web路由未匹配: ${req.method} ${req.originalUrl}`);
//     next(); // 继续到404处理
// });

// // ✅ 使用 use 方法捕获所有未匹配的请求
// webRouter.use((req, res) => {
//   console.log(`🔴 返回404: ${req.method} ${req.originalUrl}`);
//   res.status(404).json({
//     success: false,
//     error: 'ENDPOINT_NOT_FOUND',
//     message: `Web API endpoint ${req.method} ${req.originalUrl} does not exist`,
//     timestamp: new Date().toISOString()
//   });
// });


export default webRouter;