import express from 'express';
import { login, register, getAllUsers, createUser, deleteUser, getUserbyId, modifyUser } from '../controllers/user.controller.js';
import authenticate, {isAdmin} from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/', getAllUsers);
router.post('/', authenticate, createUser);

router.get('/:id', authenticate, isAdmin, getUserbyId);
router.put('/:id', authenticate, isAdmin, modifyUser);
router.delete('/:id', authenticate, isAdmin, deleteUser);



export default router;