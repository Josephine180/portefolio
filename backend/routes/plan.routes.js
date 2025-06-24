import express from 'express';
import { getAllTrainingPlans, createTrainingPlan, getTrainingPlansByUser, getTrainingPlanById } from '../controllers/plan.controller.js';
import authenticate, { isAdmin } from './middlewares/auth.js';

const router = express.Router();

router.get('/', getAllTrainingPlans);
router.get('/:userId', getTrainingPlansByUser);
router.get('/id/:planId', getTrainingPlanById);
router.post('/', authenticate, isAdmin, createTrainingPlan);


export default router;