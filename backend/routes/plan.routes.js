import express from 'express';
import { getAllTrainingPlans, createTrainingPlan, getTrainingPlansByUser, getTrainingPlanById } from '../controllers/plan.controller.js';

const router = express.Router();

router.get('/', getAllTrainingPlans);
router.get('/:userId', getTrainingPlansByUser);
router.get('/id/:planId', getTrainingPlanById);
router.post('/', createTrainingPlan);


export default router;