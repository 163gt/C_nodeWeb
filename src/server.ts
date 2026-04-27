import app from './app';
import { config } from './config';
import { AppDataSource } from './config/database';

const PORT = config.server.port;

// 等待数据库连接初始化后再启动服务器
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connection established');
    app.listen(PORT, () => {
      console.log(`🌟 Server is running on port ${PORT}`);
      console.log(`📦 Environment: ${config.env}`);
      console.log(`🔧 Mode: ${config.isDevelopment ? 'Development' : 'Production'}`);
    });
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  });