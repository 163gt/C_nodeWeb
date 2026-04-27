import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../../../config/database';
import { UserContent } from '../../../entity/entities/UserContent';

/**
 * 发布内容
 * @param req
 * @param res
 */
export const publishContent = async (req: Request, res: Response) => {
  const { badgeId, content } = req.body;

  // 参数验证
  if (!badgeId || !content) {
    return res.status(400).json({ message: '内容不能为空' });
  }

  try {
    const contentRepository = AppDataSource.getRepository(UserContent);

    const newContent = contentRepository.create({
      contentId: uuidv4(),
      badgeId,
      content,
      status: null,
      likeCount: 0,
      viewCount: 0
    });

    await contentRepository.save(newContent);

    res.status(201).json({
      message: '发布成功',
      data: {
        contentId: newContent.contentId,
        badgeId,
        content,
        status: newContent.status,
        createdAt: newContent.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '发布失败' });
  }
};

/**
 * 获取徽章对应的内容列表
 * @param req
 * @param res
 */
export const getContentsByBadge = async (req: Request, res: Response) => {
  const { badgeId } = req.params;
  const { page = 1, pageSize = 10 } = req.query;

  try {
    const contentRepository = AppDataSource.getRepository(UserContent);

    // 查询该徽章下的所有内容，按时间倒序
    const [contents, total] = await contentRepository.findAndCount({
      where: { badgeId: badgeId as string },
      order: { createdAt: 'DESC' },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize)
    });

    const formattedContents = contents.map(item => ({
      contentId: item.contentId,
      badgeId: item.badgeId,
      content: item.content,
      status: item.status,
      likeCount: item.likeCount,
      viewCount: item.viewCount,
      createdAt: item.createdAt
    }));

    res.status(200).json({
      message: '获取内容列表成功',
      data: {
        contents: formattedContents,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        hasMore: (Number(page) * Number(pageSize)) < total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * 获取最新发布的内容列表（用于首页展示）
 * @param req
 * @param res
 */
export const getLatestContents = async (req: Request, res: Response) => {
  const { page = 1, pageSize = 10 } = req.query;

  try {
    const contentRepository = AppDataSource.getRepository(UserContent);

    const [contents, total] = await contentRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize)
    });

    const formattedContents = contents.map(item => ({
      contentId: item.contentId,
      badgeId: item.badgeId,
      content: item.content,
      status: item.status,
      likeCount: item.likeCount,
      viewCount: item.viewCount,
      createdAt: item.createdAt
    }));

    res.status(200).json({
      message: '获取最新内容成功',
      data: {
        contents: formattedContents,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        hasMore: (Number(page) * Number(pageSize)) < total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * 根据内容ID获取详情
 * @param req
 * @param res
 */
export const getContentById = async (req: Request, res: Response) => {
  const { contentId } = req.params;

  try {
    const contentRepository = AppDataSource.getRepository(UserContent);
    const content = await contentRepository.findOne({
      where: { contentId: contentId as string }
    });

    if (!content) {
      return res.status(404).json({ message: '内容不存在' });
    }

    res.status(200).json({
      message: '获取内容详情成功',
      data: {
        contentId: content.contentId,
        badgeId: content.badgeId,
        content: content.content,
        status: content.status,
        likeCount: content.likeCount,
        viewCount: content.viewCount,
        createdAt: content.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
