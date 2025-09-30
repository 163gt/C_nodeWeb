import { Router } from 'express';
//文件系统
import filesRouter from '../controllers/files/filesRouter';

const fileRouter = Router();

/**
 * 文件系统
 */
//文件系统
fileRouter.use(filesRouter);


export default fileRouter;





