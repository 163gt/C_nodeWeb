import { Request, Response } from 'express';
import { AppDataSource } from '../../../config/database';
import { TestQuestion } from '../../../entity/entities/TestQuestion';

export const getAllQuestions = async (req: Request, res: Response) => {
  try {
    const questionRepository = AppDataSource.getRepository(TestQuestion);
    let questions = await questionRepository.find({
      order: { sortOrder: 'ASC' }
    });

    if (questions.length === 0) {
      await initQuestions();
      questions = await questionRepository.find({
        order: { sortOrder: 'ASC' }
      });
    }

    const formattedQuestions = questions.map(q => ({
      id: q.id,
      questionId: q.questionId,
      category: q.category,
      content: q.content,
      options: q.options,
      weight: q.weight
    }));

    res.status(200).json({
      message: '获取题目列表成功',
      data: formattedQuestions
    });
  } catch (error) {
    console.error('获取题目列表失败', error);
    res.status(500).json({ message: '获取题目列表失败' });
  }
};

export const getQuestionsByCategory = async (req: Request, res: Response) => {
  const { category } = req.params;
  
  try {
    const questionRepository = AppDataSource.getRepository(TestQuestion);
    const questions = await questionRepository
      .createQueryBuilder('question')
      .where('question.category = :category', { category })
      .orderBy('question.sortOrder', 'ASC')
      .getMany();

    const formattedQuestions = questions.map(q => ({
      id: q.id,
      questionId: q.questionId,
      category: q.category,
      content: q.content,
      options: q.options,
      weight: q.weight
    }));

    res.status(200).json({
      message: '获取分类题目成功',
      data: formattedQuestions
    });
  } catch (error) {
    console.error('获取分类题目失败', error);
    res.status(500).json({ message: '获取分类题目失败' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  res.status(200).json({
    message: '获取分类成功',
    data: [
      { id: 'bigFive', name: '大五人格', count: 10, icon: '🧠' },
      { id: 'attachment', name: '依恋模型', count: 6, icon: '💕' },
      { id: 'values', name: '价值观', count: 8, icon: '⚖️' }
    ]
  });
};

async function initQuestions() {
  const questionRepository = AppDataSource.getRepository(TestQuestion);
  
  const questions = [
    {
      questionId: 1,
      category: 'bigFive',
      content: '周末你更倾向于？',
      options: [
        { text: '独处恢复精力', scores: { E: 20 } },
        { text: '社交互动', scores: { E: 80 } }
      ],
      weight: 1,
      sortOrder: 1
    },
    {
      questionId: 2,
      category: 'bigFive',
      content: '做决定时你更依赖？',
      options: [
        { text: '理性分析', scores: { A: 40 } },
        { text: '情绪感受', scores: { A: 80 } }
      ],
      weight: 1,
      sortOrder: 2
    },
    {
      questionId: 3,
      category: 'bigFive',
      content: '你做事的方式是？',
      options: [
        { text: '随性推进', scores: { C: 30 } },
        { text: '计划执行', scores: { C: 85 } }
      ],
      weight: 1,
      sortOrder: 3
    },
    {
      questionId: 4,
      category: 'bigFive',
      content: '面对压力时你倾向于？',
      options: [
        { text: '容易焦虑', scores: { N: 80 } },
        { text: '相对稳定', scores: { N: 25 } }
      ],
      weight: 1,
      sortOrder: 4
    },
    {
      questionId: 5,
      category: 'bigFive',
      content: '面对新事物你的态度是？',
      options: [
        { text: '谨慎观察', scores: { O: 40 } },
        { text: '主动尝试', scores: { O: 85 } }
      ],
      weight: 1,
      sortOrder: 5
    },
    {
      questionId: 6,
      category: 'bigFive',
      content: '你的社交风格是？',
      options: [
        { text: '倾听为主', scores: { E: 30 } },
        { text: '主动表达', scores: { E: 85 } }
      ],
      weight: 1,
      sortOrder: 6
    },
    {
      questionId: 7,
      category: 'bigFive',
      content: '当有人需要帮助时你通常？',
      options: [
        { text: '看情况', scores: { A: 50 } },
        { text: '通常会帮', scores: { A: 85 } }
      ],
      weight: 1,
      sortOrder: 7
    },
    {
      questionId: 8,
      category: 'bigFive',
      content: '执行任务时你经常？',
      options: [
        { text: '容易拖延', scores: { C: 30 } },
        { text: '执行力强', scores: { C: 90 } }
      ],
      weight: 1,
      sortOrder: 8
    },
    {
      questionId: 9,
      category: 'bigFive',
      content: '你的情绪波动情况？',
      options: [
        { text: '波动明显', scores: { N: 85 } },
        { text: '比较稳定', scores: { N: 20 } }
      ],
      weight: 1,
      sortOrder: 9
    },
    {
      questionId: 10,
      category: 'bigFive',
      content: '你适应新环境的速度？',
      options: [
        { text: '慢热型', scores: { O: 40 } },
        { text: '快速适应', scores: { O: 85 } }
      ],
      weight: 1,
      sortOrder: 10
    },
    {
      questionId: 11,
      category: 'attachment',
      content: '当对方没有及时回复消息时，你的反应是？',
      options: [
        { text: '焦虑不安，担心出问题', scores: { anxious: 85 } },
        { text: '正常理解，相信对方', scores: { secure: 70 } },
        { text: '无所谓', scores: { avoidant: 70 } }
      ],
      weight: 1,
      sortOrder: 11
    },
    {
      questionId: 12,
      category: 'attachment',
      content: '在一段关系中，你更倾向？',
      options: [
        { text: '依赖对方', scores: { anxious: 80 } },
        { text: '信任对方', scores: { secure: 85 } },
        { text: '保持一定距离', scores: { avoidant: 75 } }
      ],
      weight: 1,
      sortOrder: 12
    },
    {
      questionId: 13,
      category: 'attachment',
      content: '争吵之后你通常会？',
      options: [
        { text: '担心失去对方', scores: { anxious: 80 } },
        { text: '主动沟通解决', scores: { secure: 85 } },
        { text: '冷处理，等对方先', scores: { avoidant: 70 } }
      ],
      weight: 1,
      sortOrder: 13
    },
    {
      questionId: 14,
      category: 'attachment',
      content: '表达自己的需求和感受时，你经常？',
      options: [
        { text: '害怕被拒绝', scores: { anxious: 75 } },
        { text: '直接表达', scores: { secure: 85 } },
        { text: '回避表达', scores: { avoidant: 70 } }
      ],
      weight: 1,
      sortOrder: 14
    },
    {
      questionId: 15,
      category: 'attachment',
      content: '你对伴侣的依赖程度？',
      options: [
        { text: '较强依赖', scores: { anxious: 85 } },
        { text: '适度的依赖', scores: { secure: 80 } },
        { text: '保持独立', scores: { avoidant: 80 } }
      ],
      weight: 1,
      sortOrder: 15
    },
    {
      questionId: 16,
      category: 'attachment',
      content: '关系中亲密感的推进节奏？',
      options: [
        { text: '快速投入', scores: { anxious: 80 } },
        { text: '稳定推进', scores: { secure: 85 } },
        { text: '保持私人空间', scores: { avoidant: 80 } }
      ],
      weight: 1,
      sortOrder: 16
    },
    {
      questionId: 21,
      category: 'values',
      content: '你理想的生活方式是？',
      options: [
        { text: '稳定可控', scores: { stability: 85 } },
        { text: '自由灵活', scores: { freedom: 85 } }
      ],
      weight: 1,
      sortOrder: 21
    },
    {
      questionId: 22,
      category: 'values',
      content: '你觉得什么更重要？',
      options: [
        { text: '物质基础', scores: { material: 85 } },
        { text: '情感满足', scores: { emotional: 85 } }
      ],
      weight: 1,
      sortOrder: 22
    },
    {
      questionId: 23,
      category: 'values',
      content: '你的人生方向更倾向？',
      options: [
        { text: '现实导向', scores: { rational: 85 } },
        { text: '理想导向', scores: { ideal: 80 } }
      ],
      weight: 1,
      sortOrder: 23
    },
    {
      questionId: 24,
      category: 'values',
      content: '你的人生排序中？',
      options: [
        { text: '家庭优先', scores: { family: 85 } },
        { text: '自我优先', scores: { self: 85 } }
      ],
      weight: 1,
      sortOrder: 24
    },
    {
      questionId: 25,
      category: 'values',
      content: '关于职业选择，你更倾向？',
      options: [
        { text: '稳定工作', scores: { stability: 80 } },
        { text: '自由职业', scores: { freedom: 80 } }
      ],
      weight: 1,
      sortOrder: 25
    },
    {
      questionId: 26,
      category: 'values',
      content: '你的消费习惯是？',
      options: [
        { text: '储蓄优先', scores: { material: 70 } },
        { text: '体验优先', scores: { emotional: 70 } }
      ],
      weight: 1,
      sortOrder: 26
    },
    {
      questionId: 27,
      category: 'values',
      content: '做重大决策时你更依赖？',
      options: [
        { text: '理性分析', scores: { rational: 85 } },
        { text: '直觉判断', scores: { ideal: 75 } }
      ],
      weight: 1,
      sortOrder: 27
    },
    {
      questionId: 28,
      category: 'values',
      content: '你的人生目标更注重？',
      options: [
        { text: '稳定发展', scores: { stability: 85 } },
        { text: '自由成长', scores: { freedom: 85 } }
      ],
      weight: 1,
      sortOrder: 28
    }
  ];

  await questionRepository.save(questions);
  console.log('测试题目初始化成功');
}
