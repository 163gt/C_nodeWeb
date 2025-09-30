import { Request, Response } from 'express';
import { AppDataSource } from '../../../config/database';
import { SysDictionaryItem } from '../../../entity/entities/SysDictionaryItem';
import { SysDictionaryType } from '../../../entity/entities/SysDictionaryType';
import { Like } from 'typeorm';
import { paginateData } from '../../../utils/page';


/**
 * 创建字典类型
 * @param req 
 * @param res 
 */
export const createDictType = async (req: Request, res: Response) => {
    const { dictionaryCode, dictionaryName, description } = req.body;
    try {
        const dictionaryTypeRepository = AppDataSource.getRepository(SysDictionaryType)
        // 查询是否已存在相同的 dictionaryCode
        const isDictionaryType = await dictionaryTypeRepository.findOne({
            where: { dictionaryCode },
        });
        if (isDictionaryType) {
            res.status(400).json({
                message: '字典类型编码已存在',
            });
        }
        // 创建新的字典类型对象
        const newDictionaryType = new SysDictionaryType();
        newDictionaryType.dictionaryCode = dictionaryCode;
        newDictionaryType.dictionaryName = dictionaryName;
        newDictionaryType.description = description;
        await dictionaryTypeRepository.save(newDictionaryType)
        res.status(200).json({
            message: '字典类型创建成功',
        });
    } catch (error) {
        res.status(500).json({
            message: '字典类型创建失败',
        });
    }
}
/**
 * 查询字典类型列表
 * @param req 
 * @param res 
 */
export const queryDictType = async (req: Request, res: Response) => {
    const { page = -1, pageSize = -1, dictionaryName } = req.query;
    const pageNo = Number(page);
    const size = Number(pageSize);
    try {
        const dictionaryTypeRepository = AppDataSource.getRepository(SysDictionaryType)
        // 构建查询条件
        const whereConditions: any = {};
        // 如果传递了 label 参数，则根据菜单名称进行模糊查询
        if (dictionaryName) {
            whereConditions.dictionaryName = Like(`%${dictionaryName}%`); // 使用 Like 进行模糊匹配
        }
        const dictionaryTypeList = await dictionaryTypeRepository.find({
            where: whereConditions,
            order: { id: 'ASC' }
        });
        // 使用 paginateData 进行分页裁剪
        const DictList = paginateData(dictionaryTypeList, pageNo, size);
        res.status(200).json({
            message: '字典列表获取成功',
            data: DictList.data,
            page: DictList.page,  // 返回当前页码，默认为 1
            pageSize: DictList.pageSize,  // 如果查询所有数据，则不分页
            total: DictList.total  // 返回查询结果的总记录数
        });
    } catch (error) {
        res.status(500).json({
            message: '字典列表获取失败',
        })
    }
}
/**
 * 修改字典类型
 * @param req 
 * @param res 
 */
export const updateDictType = async (req: Request, res: Response) => {
    const { id, dictionaryCode, dictionaryName, description, status } = req.body;
    try {
        const dictionaryTypeRepository = AppDataSource.getRepository(SysDictionaryType)
        await dictionaryTypeRepository.update(id, { dictionaryCode, dictionaryName, description, status });
        res.status(200).json({
            message: '字典类型修改成功',
        });
    } catch (error) {
        res.status(500).json({
            message: '字典类型修改失败',
        });
    }
}


/**
 * 创建字典标签
 * @param req 
 * @param res 
 */
export const createDictItem = async (req: Request, res: Response) => {
    const { dictionaryCode, label, value, status } = req.body;
    try {
        const DictItemRepository = AppDataSource.getRepository(SysDictionaryItem)

        // 查询是否已存在相同的 dictionaryCode
        const isDictionaryType = await DictItemRepository.findOne({
            where: { label },
        });
        if (isDictionaryType) {
            res.status(400).json({
                message: '字典标签已存在',
            });
        }
        // 创建新的字典类型对象
        const newDictItem = new SysDictionaryItem();
        newDictItem.dictionaryCode = dictionaryCode;
        newDictItem.label = label;
        newDictItem.value = value;
        newDictItem.status = status;
        await DictItemRepository.save(newDictItem)
        res.status(200).json({
            message: '字典标签创建成功',
        })

    } catch (error) {
        res.status(500).json({
            message: '字典标签创建失败',
        });
    }
}

/**
 * 查询字典标签列表
 * @param req 
 * @param res 
 */
export const queryDictItem = async (req: Request, res: Response) => {
    const { page = -1, pageSize = -1, dictionaryCode, label } = req.query;
    const pageNo = Number(page);
    const size = Number(pageSize);
    try {
        const DictItemRepository = AppDataSource.getRepository(SysDictionaryItem)
        if (!dictionaryCode) {
            return res.status(400).json({
                message: '请选择字典类型',
            });
        }
        // 构建查询条件
        const whereConditions: any = { dictionaryCode: dictionaryCode };
        
        // 如果传递了 label 参数，则根据菜单名称进行模糊查询
        if (label) {
            whereConditions.label = Like(`%${label}%`); // 使用 Like 进行模糊匹配
        }
        const dictItemList = await DictItemRepository.find({
            where: whereConditions,
            order: { id: 'ASC' }
        });
        // 使用 paginateData 进行分页裁剪
        const DictList = paginateData(dictItemList, pageNo, size);
        res.status(200).json({
            message: '字典列表获取成功',
            data: DictList.data,
            page: DictList.page,  // 返回当前页码，默认为 1
            pageSize: DictList.pageSize,  // 如果查询所有数据，则不分页
            total: DictList.total  // 返回查询结果的总记录数
        });

    } catch (error) {
        res.status(500).json({
            message: '字典标签列表获取失败',
        })
    }
}

/**
 * 修改字典标签
 * @param req 
 * @param res 
 */
export const updateDictItem = async (req: Request, res: Response) => {
    const { id, label, value, status } = req.body;
    try {
        const DictItemRepository = AppDataSource.getRepository(SysDictionaryItem)
        await DictItemRepository.update(id, { label, value, status });
        res.status(200).json({
            message: '字典标签修改成功',
        });
    } catch (error) {
        res.status(500).json({
            message: '字典标签修改失败',
        });
    }
}