import { Request, Response } from 'express';
import { AppDataSource } from '../../../config/database';
import { SysRole } from '../../../entity/entities/SysRole'
import jwt, { JwtPayload } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Like } from 'typeorm';
import { paginateData } from '../../../utils/page';

/**
 * 创建角色
 * @param req 
 * @param res 
 */
export const createRole = async (req: Request, res: Response) => {
    const { roleName, roleCode, rolePath, description, status } = req.body;

    try {
        const roleRepository = AppDataSource.getRepository(SysRole)
        const existingRole = await roleRepository.findOne({
            where: [
                { roleCode: roleCode },  // 检查 roleCode 是否存在
                { roleName: roleName }    // 检查 roleName 是否存在
            ]
        })
        if (existingRole) {
            return res.status(400).json({
                message: '角色名称或编码已经存在'
            });
        }
        // 如果没有重复，创建新角色
        const newRole = roleRepository.create({
            roleName,
            roleCode,
            rolePath,
            description: description || '',  // 如果没有传递 description，则设置为空字符串
            status: status || 1,  // 默认状态为 1 (正常)
        });

        await roleRepository.save(newRole);

        // 返回成功响应
        res.status(201).json({
            message: '角色创建成功',
        });

    } catch (error) {
        res.status(500).json({
            message: '角色创建失败',
        });
    }
}


/**
 * 获取角色列表
 * @param req 
 * @param res 
 */
export const getRoleList = async (req: Request, res: Response) => {
    // 获取分页参数
    const { page = -1, pageSize = -1, roleName } = req.query; // 默认值为 -1 表示查询所有数据
    const pageNo = Number(page);
    const size = Number(pageSize);    

    try {
        const roleRepository = AppDataSource.getRepository(SysRole)
        // 构建查询条件
        const whereConditions: any = {}; // 默认查询所有状态为1的路由
        // 如果传递了 roleName 参数，则根据菜单名称进行模糊查询
        if (roleName) {
            whereConditions.roleName = Like(`%${roleName}%`); // 使用 Like 进行模糊匹配
        }
        // 查询所有符合条件的数据
        const roleData = await roleRepository.find({
            where: whereConditions,
            order: { id: "ASC" } // 按 id 排序
        });        
        

        // 使用 paginateData 进行分页裁剪
        const paginatedRole = paginateData(roleData, pageNo, size);

        res.status(200).json({
            message: '角色列表获取成功',
            data: paginatedRole.data,
            page: paginatedRole.page,  // 返回当前页码，默认为 1
            pageSize: paginatedRole.pageSize,  // 如果查询所有数据，则不分页
            total: paginatedRole.total  // 返回查询结果的总记录数
        });
    } catch (error) {
        res.status(500).json({
            message: '角色列表获取失败',
        });
    }
}

/**
 * 更新角色
 * @param req 
 * @param res 
 */
export const updateRole = async (req: Request, res: Response) => {
    const { id, roleName, roleCode, rolePath, description, status } = req.body
    try {
        const roleRepository = AppDataSource.getRepository(SysRole)

        if (roleCode === 'SuperAdmin' || id === 1) {
            res.status(400).json({
                message: '超级管理员角色不允许修改',
            });
            return;
        }
        const updataRole = roleRepository.create({
            roleName,
            roleCode,
            rolePath,
            description,
            status
        })
        await roleRepository.update(id, updataRole)
        res.status(200).json({
            message: '角色更新成功',
        });
    } catch (error) {
        console.error('更新角色失败:', error);
        res.status(500).json({
            message: '角色更新失败',
        });
    }
}
