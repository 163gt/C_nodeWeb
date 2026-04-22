import dotenv from 'dotenv';
import path from 'path';

// NODE_ENV 优先，默认为 development；通过平台特定的 npm 脚本设置
const env = process.env.NODE_ENV || 'development';
const envFile = env === 'production' ? '.env.production' : '.env.development';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const config = {
  env,
  isDevelopment: env === 'development',
  isProduction: env === 'production',

  server: {
    port: parseInt(process.env.PORT || '3000', 10),
  },

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'mydb',
    // 开发环境开启 synchronize，生产环境关闭（使用 migrations）
    synchronize: env === 'development',
    logging: env === 'development',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  },

  wx: {
    appId: process.env.WX_APP_ID || '',
    appSecret: process.env.WX_APP_SECRET || '',
  },

  cors: {
    origins: process.env.CORS_ORIGIN?.split(',').map(s => s.trim()) || [
      'http://localhost:5173',
      'http://localhost:3010'
    ],
  },

  upload: {
    dir: process.env.UPLOAD_DIR || './uploads',
    servePath: process.env.SERVE_PATH || '/files',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
  },
};

export default config;
