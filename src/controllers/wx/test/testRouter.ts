import { Router } from 'express';
import { getAllQuestions, getQuestionsByCategory, getCategories } from './testController';

const testRouter = Router();

testRouter.get('/questions', getAllQuestions);
testRouter.get('/categories', getCategories);
testRouter.get('/questions/:category', getQuestionsByCategory);

export default testRouter;
