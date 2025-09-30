// src/config/file.config.ts
import * as path from 'path';

export const fileConfig = {
  uploadDir: process.env.UPLOAD_DIR || path.join(process.cwd(), 'files'),
  servePath: process.env.SERVE_PATH || '/files',
  maxFileSize: parseInt(String(process.env.MAX_FILE_SIZE)) || 10 * 1024 * 1024,
  allowedMimeTypes: [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'
  ]
};

export const getFileUrl = (filename: string): string => {
  return `${fileConfig.servePath}/${filename}`;
};