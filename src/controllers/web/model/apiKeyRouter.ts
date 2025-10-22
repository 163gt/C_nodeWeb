import { Router } from 'express';
import { verifyToken } from '../../../utils/jwt';
import { validateBody } from '../../../utils/validation.middleware';
import { addApiKeyDto } from './apiKeyInterface'
import { addApiKeyController,queryApiKeyController } from './apiKeyController';
/**
 * API Key路由
 */
const apiKeyRouter = Router();

// 创建API Key
apiKeyRouter.post('/addApiKey', verifyToken,validateBody(addApiKeyDto),addApiKeyController);

//查询API Key 列表
apiKeyRouter.get('/queryApiKey', verifyToken,queryApiKeyController);


export default apiKeyRouter;