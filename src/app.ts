import 'reflect-metadata'; // 必须放在文件首行
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';//数据库
import { FileService } from './files/FileService';//文件系统
import { fileConfig } from './config/file.config';
import router from './routes';
import webRouter from './routes/webRouter';
import fileRouter from './routes/filesRouter';


dotenv.config();


AppDataSource.initialize()
  .then(async () => {
    const fileService = new FileService();
    await fileService.initUploadDir();


    console.log(`📁 文件上传目录: ${fileConfig.uploadDir}`);
    console.log(`🌐 文件访问路径: http://localhost:${process.env.PORT || 3000}${fileConfig.servePath}`);

    console.log('TypeORM 数据源已初始化');
    // 这里可以启动 express 服务
  })
  .catch((err) => {
    console.error('TypeORM 数据源初始化失败', err);
  });

const app = express();


// 中间件
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/wx-api', router);
app.use('/web-api', webRouter);
app.use('/file', fileRouter);
// 静态文件服务 - 重要！让上传的文件可以被访问
app.use(fileConfig.servePath, express.static(fileConfig.uploadDir));


export default app;