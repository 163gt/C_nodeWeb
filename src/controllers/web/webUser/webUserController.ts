import { Request, Response } from 'express';
import { AppDataSource } from '../../../config/database';
import { SysUser } from '../../../entity/entities/SysUser';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { generateToken } from '../../../utils/jwt';
import bcrypt from 'bcrypt';
import { paginateData } from '../../../utils/page';
import { Like } from 'typeorm';


const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const saltRounds = 12;

/**
 * 创建用户
 * @param req 
 * @param res 
 */
export const webCreate = async (req: Request, res: Response) => {
    const { userName, passWord = '123456', avatar } = req.body;
    try {
        const NewPassWord = passWord === null || passWord === undefined || passWord === '' ? '123456' : passWord;
        const userRepository = AppDataSource.getRepository(SysUser);
        // 检查用户名是否已经存在
        const existingUser = await userRepository.findOne({
            where: { userName },
        });
        if (existingUser) {
            return res.status(400).json({ message: '用户名已存在' });
        }
        // 对密码进行加密        
        const hashedPassword = await bcrypt.hash(NewPassWord, saltRounds);
        // 创建用户
        const user = userRepository.create({
            userId: uuidv4(),
            userName,
            passWord: hashedPassword,
            avatar: avatar,
        });
        await userRepository.save(user);
        res.status(201).json({
            message: '用户创建成功', data: {
                userId: user.userId,
                userName: user.userName,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * 修改用户信息
 * @param req 
 * @param res 
 */
export const webUserUpdate = async (req: Request, res: Response) => {
    const { userId, userName, phoneNumber, oldPassWord, avatar, newPassWord } = req.body;
    try {
        const userRepository = AppDataSource.getRepository(SysUser);
        // 1. 查找用户
        const user = await userRepository.findOneBy({ userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "用户不存在",
            });
        }
        // 2. 构造要更新的数据
        const updateData: Partial<SysUser> = {};
        // 动态构造更新数据，排除不需要更新的字段
        Object.keys(req.body).forEach((key) => {
            // 排除不需要更新的字段（例如：userId, oldPassWord, newPassWord）
            if (
                key !== "userId" &&
                key !== "oldPassWord" &&
                key !== "newPassWord" &&
                req.body[key] !== undefined &&
                req.body[key] !== ""
            ) {
                updateData[key as keyof SysUser] = req.body[key];
            }
        });

        // 3. 密码特殊处理：校验旧密码
        if (oldPassWord && oldPassWord.trim() !== "" && newPassWord && newPassWord.trim() !== "") {
            // 校验旧密码是否正确
            const isSame = await bcrypt.compare(oldPassWord, user.passWord);
            if (!isSame) {
                return res.status(400).json({
                    success: false,
                    message: "旧密码错误，无法修改密码",
                });
            }

            // 如果旧密码正确，则更新为新密码
            const hashedPassword = await bcrypt.hash(newPassWord, saltRounds);
            updateData.passWord = hashedPassword; // 更新密码
        }
        // 4. 更新用户信息
        await userRepository.update(userId, updateData);
        return res.json({
            success: true,
            message: "用户信息修改成功",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "用户信息修改失败",
        });
    }
};

/**
 * 用户登录
 * @param req 
 * @param res 
 */
export const webLogin = async (req: Request, res: Response) => {
    const { userName, passWord } = req.body;
    try {
        const userRepository = AppDataSource.getRepository(SysUser);
        // 查询用户
        const user = await userRepository.findOne({
            where: { userName },
            select: ['userId', 'userName', 'avatar', 'passWord']
        });
        if (user) {
            // 校验密码
            const isMatch = await bcrypt.compare(passWord, user.passWord);

            if (isMatch) {
                // 密码匹配，生成 token
                const token = generateToken({ userId: user.userId });
                // 返回用户信息，但不包括密码
                const { passWord, ...userWithoutPassword } = user;  // 去除密码字段
                res.status(200).json({ data: userWithoutPassword, token });
            } else {
                // 密码不匹配
                res.status(401).json({ message: '用户名或密码错误' });
            }
        } else {
            // 用户不存在
            res.status(401).json({ message: '用户名或密码错误' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '网络错误~请稍后重试！' });
    }
};


/**
 * 获取用户列表
 * @param req
 * @param res
 */
export const getUserList = async (req: Request, res: Response) => {
    try {
        // 获取分页参数
        const { page = -1, pageSize = -1, userName } = req.query; // 默认值为 -1 表示查询所有数据
        const pageNo = Number(page);
        const size = Number(pageSize);
        const userRepository = AppDataSource.getRepository(SysUser);
        // 构建查询条件
        const whereConditions: any = {}; // 默认查询所有状态为1的路由
        // 如果传递了 routeName 参数，则根据菜单名称进行模糊查询
        if (userName) {
            whereConditions.userName = Like(`%${userName}%`); // 使用 Like 进行模糊匹配
        }
        // 查询所有符合条件的数据
        const userList = await userRepository.find({
            where: whereConditions,
        });

        // 格式化 createTime
        const formattedUserList = userList.map(user => {
            // 删除不需要的字段（如 password）
            const { passWord, ...userWithoutPassword } = user;
            const formattedCreateTime = new Date(String(user.createTime)).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });

            return {
                ...userWithoutPassword,
                createTime: formattedCreateTime, // 格式化后的 createTime
            };
        });


        const paginatedUserList = paginateData(formattedUserList, pageNo, size);
        res.status(200).json({
            message: '获取用户列表成功',
            data: paginatedUserList.data,
            total: paginatedUserList.total,
            page: paginatedUserList.page,
            pageSize: paginatedUserList.pageSize
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}



/**
 * 刷新token
 * @param req 
 * @param res 
 */
export const refUserToken = async (req: Request, res: Response) => {
    const tokenOld = req.headers.authorization;
    try {
        // 1. 解码 Token 获取 payload
        const decoded = jwt.decode(String(tokenOld)) as JwtPayload;
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
                return res.status(401).json({
                    message: 'Token 已过期',
                    allowRefresh: false, // true: 过期24小时内允许刷新；false: 需重新登录
                });
            }

        }
        const { userId } = jwt.verify(String(tokenOld), JWT_SECRET) as JwtPayload;

        if (!userId) {
            res.status(401).json({ message: 'token刷新失败' });
        }
        // 密码匹配，生成 token
        const token = generateToken({ userId: userId });
        res.status(200).json({ token });
    } catch (error) {
        res.status(401).json({ message: 'token刷新失败' });
    }
}

/**
 * 删除用户
 * @param req 
 * @param res 
 * @returns 
 */
export const deleteUser = async (req: Request, res: Response) => {
    const adminUserId = (req as any).user.userId;
    const { userId } = req.query;
    try {
        const userRepository = AppDataSource.getRepository(SysUser);
        const userInfo = await userRepository.findOneBy({ userId: String(userId) });
        if (!userInfo) {
            return res.status(404).json({ success: false, message: '用户不存在' });
        }
        const userRoleCode: string[] = userInfo.roleCode as string[];
        const hasSuperAdmin = userRoleCode.includes('SuperAdmin');
        if (hasSuperAdmin) {
            return res.status(400).json({ message: '超级管理员无法删除' })
        }
        await userRepository.delete(String(userId));
        res.status(200).json({ message: '用户删除成功' });
    } catch (error) {
        res.status(500).json({ message: '用户删除失败' });
    }
};