import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express'; // 补充类型引入
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const JWT_EXPIRES_IN: string = String(process.env.JWT_EXPIRES_IN) || '1h';
const MAX_REFRESH_WINDOW = 24 * 60 * 60; // 24小时（单位：秒）


/**
 * 下发token
 * @param payload 
 * @param expiresIn 
 * @returns 
 */
export function generateToken(
  payload: string | object | Buffer,
  expiresIn: string = JWT_EXPIRES_IN
) {
  console.log(JWT_EXPIRES_IN, 'JWT_EXPIRES_IN');

  if (!payload || typeof payload !== 'object' && typeof payload !== 'string' && !Buffer.isBuffer(payload)) {
    throw new Error('payload 必须为非空对象、字符串或 Buffer');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
}

/**
 * 校验用户token
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ 
      message: '未登录，请先登录',
      allowRefresh: false, // 无 Token 不允许刷新
    });
  }

  try {
    // 1. 解码 Token 获取 payload
    const decoded = jwt.decode(token) as JwtPayload;
    if (!decoded || typeof decoded === 'string') {
      return res.status(401).json({ 
        message: 'Token 格式无效',
        allowRefresh: false,
      });
    }

    // 2. 检查是否已过期
    if (decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000); // 当前时间（秒）
      const expiredTime = decoded.exp; // Token 过期时间（秒）
      const isExpired = currentTime >= expiredTime;

      if (isExpired) {
        // 计算过期时长（秒）
        const expiredSeconds = currentTime - expiredTime;
        const allowRefresh = expiredSeconds <= MAX_REFRESH_WINDOW;

        return res.status(401).json({ 
          message: 'Token 已过期',
          allowRefresh, // true: 过期24小时内允许刷新；false: 需重新登录
        });
      }
    }

    // 3. 验证签名（如果未过期）
    const verified = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).user = verified;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // 处理 jwt.verify() 抛出的过期错误
      const decoded = jwt.decode(token) as JwtPayload;
      const expiredSeconds = Math.floor(Date.now() / 1000) - (decoded?.exp || 0);
      const allowRefresh = expiredSeconds <= MAX_REFRESH_WINDOW;

      return res.status(401).json({ 
        message: 'Token 已过期',
        allowRefresh,
      });
    }
    return res.status(401).json({ 
      message: 'Token 无效',
      allowRefresh: false,
    });
  }
}