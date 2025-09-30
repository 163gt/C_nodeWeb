// src/middleware/upload.ts
import multer from 'multer';
import { fileConfig } from '../config/file.config';

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (fileConfig.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`不支持的文件类型: ${file.mimetype}`), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: fileConfig.maxFileSize },
  fileFilter
});