import express from 'express';
import prisma from './src/index.js';
import userRoutes from './routes/user.routes.js';
import dotenv from 'dotenv';
import trainingPlanRoutes from './routes/plan.routes.js';
import sessionRoutes from './routes/session.routes.js';


const app = express();

app.use(express.json())

app.use('/users', userRoutes);
app.use('/training-plans', trainingPlanRoutes);
app.use('/sessions', sessionRoutes);

dotenv.config();

export default app;