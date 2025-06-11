import express from 'express';
import { getAllUsers, createUser, deleteUser, getUserbyId, modifyUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/:id', getUserbyId);
router.put('/:id', modifyUser);
router.delete('/:id', deleteUser);

export default router;