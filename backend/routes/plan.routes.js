import express from 'express';
import { getAllTrainingPlans, createTrainingPlan, getTrainingPlansByUser } from '../controllers/plan.controller.js';

const router = express.Router();

router.get('/training-plans', getAllTrainingPlans);
router.get('/:userId', getTrainingPlansByUser);
router.post('/', createTrainingPlan);


export default router;