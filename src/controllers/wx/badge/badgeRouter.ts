import { Router } from 'express';
import { getAllBadges, getBadgeById, getBadgeStatistics, initBadges } from './badgeController';

/**
 * 徽章路由
 */
const badgeRouter = Router();

// 获取所有徽章
badgeRouter.get('/all', getAllBadges);

// 根据ID获取徽章详情
badgeRouter.get('/:badgeId', getBadgeById);

// 获取统计数据
badgeRouter.get('/statistics/all', getBadgeStatistics);

// 初始化徽章数据（开发用）
badgeRouter.post('/init', initBadges);

export default badgeRouter;
