import { Router } from 'express';
import { verifyToken } from '../../../utils/jwt';
import { validateBody } from '../../../utils/validation.middleware';
import { NonCurrentFlowDto } from './hunyuanInterface'
import { nonCurrentFlow } from './hunyuanController';

/** 混元模型路由 */
const hunyuanRouter = Router();

//混元模型——非流式对话
hunyuanRouter.post('/nonCurrentFlow',verifyToken,validateBody(NonCurrentFlowDto),nonCurrentFlow)


export default hunyuanRouter;