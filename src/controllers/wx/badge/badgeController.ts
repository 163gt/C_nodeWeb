import { Request, Response } from 'express';
import { AppDataSource } from '../../../config/database';
import { Badge } from '../../../entity/entities/Badge';
import { UserContent } from '../../../entity/entities/UserContent';

/**
 * 获取所有徽章列表（动态计算占比）
 * @param req
 * @param res
 */
export const getAllBadges = async (req: Request, res: Response) => {
  try {
    const badgeRepository = AppDataSource.getRepository(Badge);
    const contentRepository = AppDataSource.getRepository(UserContent);

    // 获取所有徽章
    const badges = await badgeRepository.find({
      order: { id: 'ASC' }
    });

    // 统计每个徽章的内容数量
    const badgeStats: Array<{ badgeId: string; count: string }> = await contentRepository
      .createQueryBuilder('content')
      .select('content.badgeId', 'badgeId')
      .addSelect('COUNT(*)', 'count')
      .groupBy('content.badgeId')
      .getRawMany();

    // 转换为 Map 便于查找
    const statsMap = new Map<string, number>();
    badgeStats.forEach((item: { badgeId: string; count: string }) => {
      statsMap.set(item.badgeId, parseInt(item.count));
    });

    // 计算总内容数
    const totalContents = Array.from(statsMap.values()).reduce((sum, count) => sum + count, 0);

    // 格式化返回数据，动态计算百分比
    const formattedBadges = badges.map(badge => {
      const count = statsMap.get(badge.badgeId) || 0;
      const percentage = totalContents > 0 ? parseFloat(((count / totalContents) * 100).toFixed(2)) : 0;

      return {
        id: badge.badgeId,
        name: badge.name,
        color: badge.color,
        gradient: badge.gradient,
        icon: badge.icon,
        meaning: badge.meaning,
        description: badge.description,
        count: count,
        percentage: percentage
      };
    });

    res.status(200).json({
      message: '获取徽章列表成功',
      data: formattedBadges
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * 根据徽章ID获取详情（动态计算占比）
 * @param req
 * @param res
 */
export const getBadgeById = async (req: Request, res: Response) => {
  const { badgeId } = req.params;
  try {
    const badgeRepository = AppDataSource.getRepository(Badge);
    const contentRepository = AppDataSource.getRepository(UserContent);

    const badge = await badgeRepository.findOne({
      where: { badgeId: badgeId as string }
    });

    if (!badge) {
      return res.status(404).json({ message: '徽章不存在' });
    }

    // 动态计算该徽章的内容数和总内容数
    const totalCount = await contentRepository.count();
    const badgeCount = await contentRepository.count({
      where: { badgeId: badgeId as string }
    });

    const percentage = totalCount > 0 ? parseFloat(((badgeCount / totalCount) * 100).toFixed(2)) : 0;

    res.status(200).json({
      message: '获取徽章详情成功',
      data: {
        id: badge.badgeId,
        name: badge.name,
        color: badge.color,
        gradient: badge.gradient,
        icon: badge.icon,
        meaning: badge.meaning,
        description: badge.description,
        count: badgeCount,
        percentage: percentage
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * 获取徽章统计数据（动态计算）
 * @param req
 * @param res
 */
export const getBadgeStatistics = async (req: Request, res: Response) => {
  try {
    const badgeRepository = AppDataSource.getRepository(Badge);
    const contentRepository = AppDataSource.getRepository(UserContent);

    const badges = await badgeRepository.find({
      select: ['badgeId', 'name']
    });

    // 统计每个徽章的内容数量
    const badgeStats: Array<{ badgeId: string; count: string }> = await contentRepository
      .createQueryBuilder('content')
      .select('content.badgeId', 'badgeId')
      .addSelect('COUNT(*)', 'count')
      .groupBy('content.badgeId')
      .getRawMany();

    // 转换为 Map 便于查找
    const statsMap = new Map<string, number>();
    let totalContents = 0;
    badgeStats.forEach((item: { badgeId: string; count: string }) => {
      const count = parseInt(item.count);
      statsMap.set(item.badgeId, count);
      totalContents += count;
    });

    // 构建统计数据，动态计算百分比
    const statistics = badges.reduce((acc, badge) => {
      const count = statsMap.get(badge.badgeId) || 0;
      const percentage = totalContents > 0 ? parseFloat(((count / totalContents) * 100).toFixed(2)) : 0;
      acc[badge.badgeId] = {
        count: count,
        percentage: percentage
      };
      return acc;
    }, {} as Record<string, { count: number; percentage: number }>);

    res.status(200).json({
      message: '获取统计数据成功',
      data: statistics
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * 初始化徽章数据（如果为空则插入默认数据）
 * @param req
 * @param res
 */
export const initBadges = async (req: Request, res: Response) => {
  try {
    const badgeRepository = AppDataSource.getRepository(Badge);
    const count = await badgeRepository.count();

    if (count === 0) {
      const defaultBadges = [
        {
          badgeId: 'working',
          name: '工作中',
          icon: '💻',
          color: '#4A90D9',
          gradient: ['#4A90D9', '#6BA3E0'],
          meaning: '专注、认真、在岗',
          description: '工作中',
          count: 0,
          percentage: 0
        },
        {
          badgeId: 'fishing',
          name: '摸鱼中',
          icon: '🐟',
          color: '#7CB342',
          gradient: ['#7CB342', '#9CCC65'],
          meaning: '摸鱼、小憩、偷闲',
          description: '摸鱼中',
          count: 0,
          percentage: 0
        },
        {
          badgeId: 'eating',
          name: '吃饭中',
          icon: '🍚',
          color: '#FF9800',
          gradient: ['#FF9800', '#FFB74D'],
          meaning: '干饭、用餐、治愈',
          description: '吃饭中',
          count: 0,
          percentage: 0
        },
        {
          badgeId: 'alone',
          name: '一个人',
          icon: '🌙',
          color: '#7E57C2',
          gradient: ['#7E57C2', '#9575CD'],
          meaning: '独处、自在、安静',
          description: '一个人',
          count: 0,
          percentage: 0
        },
        {
          badgeId: 'tired',
          name: '有点累',
          icon: '😴',
          color: '#78909C',
          gradient: ['#78909C', '#90A4AE'],
          meaning: '疲惫、需要休息、舒缓',
          description: '有点累',
          count: 0,
          percentage: 0
        },
        {
          badgeId: 'relaxing',
          name: '放松中',
          icon: '🎧',
          color: '#26A69A',
          gradient: ['#26A69A', '#4DB6AC'],
          meaning: '放空、治愈、充电',
          description: '放松中',
          count: 0,
          percentage: 0
        }
      ];

      await badgeRepository.save(defaultBadges);
      res.status(201).json({ message: '徽章数据初始化成功' });
    } else {
      res.status(200).json({ message: '徽章数据已存在' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
