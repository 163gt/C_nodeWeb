// src/services/FileService.ts
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { fileConfig, getFileUrl } from '../config/file.config';
import { AppDataSource } from '../config/database'; // 你的TypeORM配置
import { Files } from '../entity/entities/Files'; // 你的实体类

export class FileService {
  private fileRepository = AppDataSource.getRepository(Files);

  // 初始化上传目录
  initUploadDir(): void {
    if (!fs.existsSync(fileConfig.uploadDir)) {
      fs.mkdirSync(fileConfig.uploadDir, { recursive: true });
      console.log(`创建上传目录: ${fileConfig.uploadDir}`);
    }
  }

  // 处理图片
  async processImage(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  }

  // 保存文件
  async saveFile(fileData: Express.Multer.File, userId?: number): Promise<any> {
    const fileExtension = path.extname(fileData.originalname);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(fileConfig.uploadDir, uniqueFilename);
    
    let processedBuffer = fileData.buffer;

    // 处理图片
    if (fileData.mimetype.startsWith('image/')) {
      processedBuffer = await this.processImage(fileData.buffer);
    }

    // 保存到磁盘
    fs.writeFileSync(filePath, processedBuffer);

    // 保存到数据库
    const file = this.fileRepository.create({
      originalName: fileData.originalname,
      filename: uniqueFilename,
      mimetype: fileData.mimetype,
      size: processedBuffer.length,
      path: filePath,
      url: getFileUrl(uniqueFilename),
      uploadedBy: String(userId || null),
    });

    return await this.fileRepository.save(file);
  }

  // 获取文件信息
  async getFileById(id: number): Promise<any> {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) throw new Error('文件不存在');
    return file;
  }

  // 删除文件
  async deleteFile(id: number): Promise<void> {
    const file = await this.getFileById(id);
    
    // 删除物理文件
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    
    // 删除数据库记录
    await this.fileRepository.delete(id);
  }
}