// src/controllers/FileController.ts
import { Request, Response } from 'express';
import { FileService } from '../../files/FileService';

const fileService = new FileService();

/**
 * 上传文件
 */
export const uploadFile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: '请选择要上传的文件' });
            return;
        }
        const userId = (req as any).user.userId;
        const file = await fileService.saveFile(req.file, userId);        

        res.json({
            success: true,
            message: '文件上传成功',
            data: {
                id: file.id,
                originalName: file.originalName,
                filename: file.filename,
                url: file.url,
                size: file.size,
                createdAt: file.createdAt,
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * 获取文件信息
 */
export const getFile = async (req: Request, res: Response): Promise<void> => {
    try {
        const fileId = parseInt(req.params.id as string);
        const file = await fileService.getFileById(fileId);
        res.json({ success: true, data: file });
    } catch (error: any) {
        res.status(404).json({ success: false, message: error.message });
    }
};

/**
 * 删除文件（修复：添加归属校验）
 */
export const deleteFile = async (req: Request, res: Response): Promise<void> => {
    try {
        const fileId = parseInt(req.params.id as string);
        const userId = (req as any).user?.userId;
        
        // 获取文件信息
        const file = await fileService.getFileById(fileId);
        
        // 检查文件是否存在
        if (!file) {
            res.status(404).json({ success: false, message: '文件不存在' });
            return;
        }
        
        // 检查文件归属：仅文件所有者可删除
        if (file.uploadedBy !== userId) {
            res.status(403).json({ 
                success: false, 
                message: '无权删除他人文件' 
            });
            return;
        }
        
        await fileService.deleteFile(fileId);
        res.json({ success: true, message: '文件删除成功' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};