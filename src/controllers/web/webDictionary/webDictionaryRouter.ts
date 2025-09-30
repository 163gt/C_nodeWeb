import { Router } from 'express';
import { verifyToken } from '../../../utils/jwt';
import { validateBody } from '../../../utils/validation.middleware';
import { createDictTypeDto,updateDictTypeDto,createDictItemDto,updateDictItemDto } from './webDictionaryInterface';
import { createDictType,updateDictType,queryDictType,updateDictItem,queryDictItem,createDictItem } from './webDictionaryController';
/**
 * 字典路由
 */
const DictionaryRouters = Router();

//创建字典类型
DictionaryRouters.post('/createDictionaryType',verifyToken,validateBody(createDictTypeDto),createDictType)
//修改字典类型
DictionaryRouters.post('/updateDictionaryType',verifyToken,validateBody(updateDictTypeDto),updateDictType)
//查询字典类型列表
DictionaryRouters.get('/queryDictionaryType',verifyToken,queryDictType)

//创建字典项
DictionaryRouters.post('/createDictionaryItem',verifyToken,validateBody(createDictItemDto),createDictItem)
//修改字典项
DictionaryRouters.post('/updateDictionaryItem',verifyToken,validateBody(updateDictItemDto),updateDictItem)
//查询字典项列表
DictionaryRouters.get('/queryDictionaryItem',verifyToken,queryDictItem)


export default DictionaryRouters;