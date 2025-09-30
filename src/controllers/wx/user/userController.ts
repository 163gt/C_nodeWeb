import { Request, Response } from 'express';
import { AppDataSource } from '../../../config/database';
import { User } from '../../../entity/entities/User';
import { v4 as uuidv4 } from 'uuid';
import { generateToken } from '../../../utils/jwt';
import axios from 'axios';

/**
 * 微信登录
 * @param req 
 * @param res 
 * @returns 
 */
export const wxLogin = async (req: Request, res: Response) => {  
  const { code } = req.body;
  try {
    // 1. 请求微信接口获取 openid
    const wxRes = await axios.get(`https://api.weixin.qq.com/sns/jscode2session`, {
      params: {
        appid: process.env.WX_APP_ID,
        secret: process.env.WX_APP_SECRET,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });
    const { wxOpenid, errmsg, errcode } = wxRes.data;

    if (errmsg) {
      return res.status(400).json({ message: '微信登录失败', detail: wxRes.data });
    }
    const userRepository = AppDataSource.getRepository(User);

    // 2. 查询数据库是否有该 openid 的用户
    let user = await userRepository.findOne({ where: { openid: wxOpenid } });

    // 3. 如果没有，注册新用户
    if (!user) {
      user = userRepository.create({
        userId: uuidv4(),
        openid: wxOpenid,
        username: `微信用户_${Date.now()}`,
        createdAt: new Date(),
      });
      await userRepository.save(user);
    }
    // 4. 返回用户信息（不包含敏感字段）
    const { userId, openid, username, avatarUrl } = user;
    const token = generateToken({ userId, openid });
    res.status(200).json({ data: { userId, openid, username, avatarUrl }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * 查询所有用户
 * @param req 
 * @param res 
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    // 查询所有用户
    const users = await userRepository.find({
      select: ['userId', 'username', 'openid', 'avatarUrl'] // 不返回 password 字段
    });
    res.status(200).json({ data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * 获取当前用户信息
 * @param req 
 * @param res 
 */
export const getUserinfo = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId; // 根据 JWT 结构调整字段名
  try {
    const userRepository = AppDataSource.getRepository(User);
    // 查询单个用户
    const user = await userRepository.findOne({
      where: { userId: userId },
      select: ['userId', 'username', 'openid', 'avatarUrl'] // 不返回 password 字段
    });
    if (user) {
      res.status(200).json({ data: user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};