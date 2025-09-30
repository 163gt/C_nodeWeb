import { Router } from 'express';
import { verifyToken } from '../../utils/jwt';
import { upload } from '../../utils/uploadFile';
import { uploadFile, getFile, deleteFile } from './FileController';

/** 文件路由 */
const filesRouter = Router();

// 上传文件
filesRouter.post('/upload', verifyToken, upload.single('file'), uploadFile);

// 获取文件信息
filesRouter.get('/:id', verifyToken, getFile);

// 删除文件
filesRouter.delete('/:id', verifyToken, deleteFile);

export default filesRouter;