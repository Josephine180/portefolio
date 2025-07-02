import express from 'express';
import { getUserActiveTrainingPlan, getAllTrainingPlans, createTrainingPlan, getTrainingPlanById, startTrainingPlan } from '../controllers/plan.controller.js';
import authenticate, {isAdmin} from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllTrainingPlans);
router.get('/user/active-plan', authenticate, getUserActiveTrainingPlan);
router.post('/start', authenticate, startTrainingPlan);
router.get('/id/:planId', getTrainingPlanById);
router.post('/', authenticate, isAdmin, createTrainingPlan);

export default router;