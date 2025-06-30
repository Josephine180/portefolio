import express from 'express';
import { getAllTrainingPlans, createTrainingPlan, getTrainingPlansByUser, getTrainingPlanById, startTrainingPlan } from '../controllers/plan.controller.js';
import authenticate, {isAdmin} from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllTrainingPlans);
router.get('/id/:planId', getTrainingPlanById);
router.get('/:userId', getTrainingPlansByUser);
router.post('/', authenticate, isAdmin, createTrainingPlan);
router.post('/start', authenticate, startTrainingPlan);

export default router;