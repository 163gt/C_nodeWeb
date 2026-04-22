// src/config/file.config.ts
import * as path from 'path';
import { config } from './index';

export const fileConfig = {
  uploadDir: path.resolve(process.cwd(), config.upload.dir),
  servePath: config.upload.servePath,
  maxFileSize: config.upload.maxFileSize,
  allowedMimeTypes: [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'
  ]
};

export const getFileUrl = (filename: string): string => {
  return `${fileConfig.servePath}/${filename}`;
};