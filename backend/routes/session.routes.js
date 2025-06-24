import express from 'express';
import { getSessionById, SessionFeedback, getAllSessions, createSession, markSessionAsCompleted } from '../controllers/session.controller.js';
import authenticate, { isAdmin } from './middlewares/auth.js';

const router = express.Router();

router.get('/', getAllSessions);
router.post('/', authenticate, isAdmin, createSession);
router.patch('/:id/complete', markSessionAsCompleted);
router.get('/:id', getSessionById);
router.post('/:id/feedback', SessionFeedback);

export default router;

