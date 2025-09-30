import { Router } from 'express';
import { verifyToken } from '../../../utils/jwt';
import { validateBody } from '../../../utils/validation.middleware';
import { webRoleDto } from './webRoleInterface'
import { createRole,getRoleList,updateRole } from './webRoleController';
/**
 * 角色路由
 */
const webRoleRouters = Router();

//创建角色
webRoleRouters.post('/createRole', verifyToken, validateBody(webRoleDto), createRole);

//获取角色列表
webRoleRouters.get('/getRoleList', verifyToken, getRoleList);

//更新角色
webRoleRouters.post('/updateRole', verifyToken, validateBody(webRoleDto), updateRole);

export default webRoleRouters;