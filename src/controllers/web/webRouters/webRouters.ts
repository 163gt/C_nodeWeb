import { Router } from 'express';
import { verifyToken } from '../../../utils/jwt';
import { validateBody } from '../../../utils/validation.middleware';
import { createRouter, updatedRouter,getTreeRouterList,getRouterList } from './webRoutersController'
import { webRoutersCreateDto } from './webRoutersInterface'
/**
 * 菜单路由
 */
const webRouters = Router();

//新增菜单
webRouters.post('/createRouter',verifyToken,validateBody(webRoutersCreateDto),createRouter)

//更新菜单
webRouters.post('/updateRouter',verifyToken,validateBody(webRoutersCreateDto),updatedRouter)

//获取菜单列表树状
webRouters.get('/getTreeRouterList',verifyToken,getTreeRouterList)

//获取菜单列表
webRouters.get('/getRouterList',verifyToken,getRouterList)

export default webRouters;