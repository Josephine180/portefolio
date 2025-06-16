import express from 'express';
import { getWeeksByPlanId, getWeekById, createWeek, updateWeek, deleteWeek } from '../controllers/week.controller.js';

const router = express.Router();

router.post('/', createWeek);
router.get('/plan/:planId', getWeeksByPlanId);
router.get('/:id', getWeekById);
router.put('/:id', updateWeek);
router.delete('/:id', deleteWeek);

export default router;
