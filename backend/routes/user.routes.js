import express from 'express';
import { login, register, getAllUsers, createUser, deleteUser, getUserbyId, modifyUser } from '../controllers/user.controller.js';
import authenticate  from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/', getAllUsers);
router.post('/', createUser);

router.get('/:id', authenticate, getUserbyId);
router.put('/:id', modifyUser);
router.delete('/:id', deleteUser);



export default router;