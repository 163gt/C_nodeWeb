import { Request, Response } from 'express';
import { AppDataSource } from '../../../config/database';
import { SysRoute } from '../../../entity/entities/SysRoute';
import { SysUser } from '../../../entity/entities/SysUser';
import { SysRole } from '../../../entity/entities/SysRole';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Like } from 'typeorm';
import { paginateData } from '../../../utils/page';
/**
 * 创建菜单
 * @param req 
 * @param res 
 */
export const createRouter = async (req: Request, res: Response) => {
    const { path, title, hidden, component = '', name = '', parentComponent, status = 1, sorting } = req.body;
    try {
        const routerRepository = AppDataSource.getRepository(SysRoute)
        const data = routerRepository.create({
            path,
            title,
            hidden,
            component,
            name,
            parentComponent,
            status,
            sorting,
        })
        await routerRepository.save(data)
        res.status(200).json({
            message: '菜单创建成功',
        });
    } catch (error) {
        console.error('创建菜单失败:', error);
        res.status(500).json({
            message: '菜单创建失败',
        });
    }
}

/**
 * 更新菜单
 * @param req 
 * @param res 
 */
export const updatedRouter = async (req: Request, res: Response) => {
    const { id, path, title, hidden, component = '', name = '', parentComponent, status = 1, sorting } = req.body;
    try {
        const routerRepository = AppDataSource.getRepository(SysRoute)
        const data = routerRepository.create({
            path,
            title,
            hidden,
            component,
            name,
            parentComponent,
            status,
            sorting,
        })
        await routerRepository.update(id, data)
        res.status(200).json({
            message: '菜单更新成功',
        });
    } catch (error) {
        console.error('更新菜单失败:', error);
        res.status(500).json({
            message: '菜单更新失败',
        });
    }
}

/**
 * 获取菜单列表树状
 * @param req 
 * @param res 
 */
export const getTreeRouterList = async (req: Request, res: Response) => {
    const { type = 1 } = req.query;
    const userId = (req as any).user.userId;
    //1查询所有路由 2查询角色路由菜单
    try {
        const routerRepository = AppDataSource.getRepository(SysRoute)
        const userRepository = AppDataSource.getRepository(SysUser);
        const roleRepository = AppDataSource.getRepository(SysRole)
        // 构建查询条件
        const routeWhereConditions: any = { status: 1 };
        const userWhereConditions: any = { status: 1 };
        const roleWhereConditions: any = { status: 1 };
        // 先查询出所有 status=1 的路由，并按 sorting 排序
        const routers = await routerRepository.find({
            where: routeWhereConditions,
            order: { sorting: "ASC" }
        });
        const routered: any[] = [];

        if (type != 1) {
            const userInfo = await userRepository.findOne({
                where: { userId }
            })
            if (!userInfo) {
                return res.status(404).json({ success: false, message: '用户不存在' });
            }
            // 拿到用户的所有角色编码
            const roleCodes: string[] = userInfo.roleCode as string[];
            const hasSuperAdmin = roleCodes.includes('SuperAdmin');
            if (!hasSuperAdmin) {
                // 查询这些角色对应的所有路由
                if (roleCodes.length > 0) {
                    const roleRoutes = await roleRepository
                        .createQueryBuilder('role')
                        .where('role.status = :status', roleWhereConditions)
                        .andWhere('role.roleCode IN (:...roleCodes)', { roleCodes })
                        .getMany();
                    // 扁平化并去重所有角色的 rolePath
                    const uniqueRolePaths = [...new Set(roleRoutes.flatMap(role => role.rolePath))];
                    const filteredRouters = uniqueRolePaths
                        .map(rolePathId => routers.find(router => router.id === Number(rolePathId))) // 查找对应的路由
                        .filter(router => router !== undefined); // 过滤掉 undefined（如果找不到对应路由）
                    routered.push(...filteredRouters)
                    // 扩展过滤出的路由数据，找到每个路由的父路由和子路由
                    filteredRouters.forEach(router => {
                        // 查找当前路由的父路由
                        const parentRoute = routers.find(r => r.path === router.parentComponent);
                        // 查找当前路由的所有子路由
                        const childRoutes = routers.filter(r => r.parentComponent === router.path);

                        if (parentRoute) {
                            routered.push(parentRoute)
                        }
                        if (childRoutes) {
                            routered.push(...childRoutes)
                        }
                    });
                }
            } else {
                routered.push(...routers)
            }
        } else {
            routered.push(...routers)
        }
        // 组装树形结构
        const buildTree = (parentPath: string | null): SysRoute[] => {
            return routered
                .filter(route => (route.parentComponent || null) === (parentPath || null))
                .map(route => {
                    // 核心：在组装对象时，先将 hidden 转换为 boolean
                    const hiddenAsBoolean = Boolean(route.hidden); // 或者 route.hidden !== 0
                    const childrens = buildTree(route.path);
                    return {
                        ...route,
                        hidden: hiddenAsBoolean, // 将 hidden 转换为 boolean
                        meta: {
                            title: route.title,
                        },
                        children: childrens.length > 0 ? childrens : null,
                    };
                });
        };

        const treeData = buildTree(null); // 从一级菜单开始构建

        res.status(200).json({
            message: '菜单列表获取成功',
            data: treeData
        });
    } catch (error) {
        console.error('获取菜单列表失败:', error);
        res.status(500).json({
            message: '菜单列表获取失败',
        });
    }
}

/**
 * 获取菜单列表
 * @param req 
 * @param res 
 */
export const getRouterList = async (req: Request, res: Response) => {
    try {
        // 获取分页参数
        const { page = -1, pageSize = -1, routeName } = req.query; // 默认值为 -1 表示查询所有数据
        const pageNo = Number(page);
        const size = Number(pageSize);

        const routerRepository = AppDataSource.getRepository(SysRoute)

        // 构建查询条件
        const whereConditions: any = {}; // 默认查询所有状态为1的路由
        // 如果传递了 routeName 参数，则根据菜单名称进行模糊查询
        if (routeName) {
            whereConditions.title = Like(`%${routeName}%`); // 使用 Like 进行模糊匹配
        }

        // 查询所有符合条件的数据
        const routers = await routerRepository.find({
            where: whereConditions,
            order: { id: "ASC" } // 按 id 排序
        });

        // 使用 paginateData 进行分页裁剪
        const paginatedRouters = paginateData(routers, pageNo, size);

        // 对结果进行映射，转换 hidden 字段
        const transformedRouters = paginatedRouters.data.map(route => ({
            ...route,
            hidden: Boolean(route.hidden) // 核心转换：将 0/1 转为 false/true
        }));
        res.status(200).json({
            message: '菜单列表获取成功',
            data: transformedRouters,
            page: paginatedRouters.page,  // 返回当前页码，默认为 1
            pageSize: paginatedRouters.pageSize,  // 如果查询所有数据，则不分页
            total: paginatedRouters.total  // 返回查询结果的总记录数
        });
    } catch (error) {
        console.error('获取菜单列表失败:', error);
        res.status(500).json({
            message: '菜单列表获取失败',
        });
    }
}