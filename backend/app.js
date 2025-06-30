import express from 'express';
import prisma from './src/index.js';
import userRoutes from './routes/user.routes.js';
import dotenv from 'dotenv';
import trainingPlanRoutes from './routes/plan.routes.js';
import sessionRoutes from './routes/session.routes.js';
import nutritionRoutes from './routes/nutrition.routes.js';
import weekRoutes from './routes/week.routes.js';
import cors from 'cors';
const app = express();


app.use(express.json())
app.use(cors());

app.use('/users', userRoutes);
app.use('/training-plans', trainingPlanRoutes);
app.use('/sessions', sessionRoutes);
app.use('/nutrition', nutritionRoutes);
app.use('/weeks', weekRoutes);

dotenv.config();

export default app;