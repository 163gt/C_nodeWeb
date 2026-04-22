import { Router } from 'express';
import { validateBody } from '../../../utils/validation.middleware';
import { PublishContentDto } from './publishContentDto';
import { getContentsByBadge, getContentById, getLatestContents, publishContent } from './contentController';

/**
 * 内容路由
 */
const contentRouter = Router();

// 发布内容
contentRouter.post('/publish', validateBody(PublishContentDto), publishContent);

// 获取所有徽章的最新内容
contentRouter.get('/latest', getLatestContents);

// 根据徽章ID获取内容列表
contentRouter.get('/badge/:badgeId', getContentsByBadge);

// 根据内容ID获取详情
contentRouter.get('/:contentId', getContentById);

export default contentRouter;
