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
import { Badge } from './entity/entities/Badge';

dotenv.config();

// 初始化徽章数据函数
async function initBadges(dataSource: typeof AppDataSource) {
  const badgeRepository = dataSource.getRepository(Badge);
  const count = await badgeRepository.count();

  if (count === 0) {
    const defaultBadges = [
      {
        badgeId: 'working',
        name: '工作中',
        icon: '💻',
        color: '#4A90D9',
        gradient: ['#4A90D9', '#6BA3E0'],
        meaning: '专注、认真、在岗',
        description: '工作中',
        count: 35000,
        percentage: 35
      },
      {
        badgeId: 'fishing',
        name: '摸鱼中',
        icon: '🐟',
        color: '#7CB342',
        gradient: ['#7CB342', '#9CCC65'],
        meaning: '摸鱼、小憩、偷闲',
        description: '摸鱼中',
        count: 23000,
        percentage: 23
      },
      {
        badgeId: 'eating',
        name: '吃饭中',
        icon: '🍚',
        color: '#FF9800',
        gradient: ['#FF9800', '#FFB74D'],
        meaning: '干饭、用餐、治愈',
        description: '吃饭中',
        count: 8000,
        percentage: 8
      },
      {
        badgeId: 'alone',
        name: '一个人',
        icon: '🌙',
        color: '#7E57C2',
        gradient: ['#7E57C2', '#9575CD'],
        meaning: '独处、自在、安静',
        description: '一个人',
        count: 12000,
        percentage: 12
      },
      {
        badgeId: 'tired',
        name: '有点累',
        icon: '😴',
        color: '#78909C',
        gradient: ['#78909C', '#90A4AE'],
        meaning: '疲惫、需要休息、舒缓',
        description: '有点累',
        count: 16000,
        percentage: 16
      },
      {
        badgeId: 'relaxing',
        name: '放松中',
        icon: '🎧',
        color: '#26A69A',
        gradient: ['#26A69A', '#4DB6AC'],
        meaning: '放空、治愈、充电',
        description: '放松中',
        count: 6000,
        percentage: 6
      }
    ];

    await badgeRepository.save(defaultBadges);
    console.log('🎖️ 徽章数据初始化成功');
  }
}

AppDataSource.initialize()
  .then(async () => {
    const fileService = new FileService();
    await fileService.initUploadDir();

    // 初始化徽章数据
    await initBadges(AppDataSource);

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
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:3010'],
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