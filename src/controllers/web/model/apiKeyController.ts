import { Request, Response } from 'express';
import { AppDataSource } from '../../../config/database';
import { ModelApikey } from '../../../entity/entities/ModelApikey';
import { Like } from 'typeorm';
import { paginateData } from '../../../utils/page';



/**
 * 添加API Key
 * @param req 
 * @param res 
 */
export const addApiKeyController = async (req: Request, res: Response) => {
    const { modelKeyName, apiKeyValue, baseUrl, apiKeyDesc, status } = req.body;
    try {
        const apiKeyRepository = AppDataSource.getRepository(ModelApikey);
        // 创建API Key
        const apiKey = apiKeyRepository.create({
            modelKeyName,
            apiKeyValue,
            apiKeyDesc,
            baseUrl,
            status
        });
        await apiKeyRepository.save(apiKey);
        res.status(201).json({
            message: 'API Key 创建成功'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'API Key 创建失败', error });
    }
}

/**
 * 查询API key列表
 * @param req 
 * @param res 
 */
export const queryApiKeyController = async (req: Request, res: Response) => {
    const { modelKeyName, page = -1, pageSize = -1, } = req.query;
    const pageNo = Number(page);
    const size = Number(pageSize);
    const apiKeyRepository = AppDataSource.getRepository(ModelApikey);
    try {
        const queryBuilder = apiKeyRepository
            .createQueryBuilder('apiKey')
            .select([
                'apiKey.id',
                'apiKey.modelKeyName',
                'apiKey.baseUrl',
                'apiKey.apiKeyDesc',
                'apiKey.status',
            ]);

        if (modelKeyName) {
            queryBuilder.where('apiKey.modelKeyName LIKE :name', {
                name: `%${modelKeyName}%`,
            });
        }
        const apiKeyList = await queryBuilder.getMany();
        const paginatedApiKeyList = paginateData(apiKeyList, pageNo, size);
        res.status(200).json({
            message: '获取API Key列表成功',
            data: paginatedApiKeyList.data,
            total: paginatedApiKeyList.total,
            page: paginatedApiKeyList.page,
            pageSize: paginatedApiKeyList.pageSize
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'API Key 查询失败', error });
    }
}