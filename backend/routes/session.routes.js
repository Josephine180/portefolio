import express from 'express';
import { getSessionById, SessionFeedback, getAllSessions, createSession, markSessionAsCompleted } from '../controllers/session.controller.js';
import authenticate, {isAdmin} from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllSessions);
router.post('/', authenticate, createSession);
router.patch('/:id/complete', authenticate, markSessionAsCompleted);
router.get('/:id', authenticate, getSessionById);
router.post('/:id/feedback',authenticate, isAdmin, SessionFeedback);

export default router;

