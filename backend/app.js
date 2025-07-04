import express from 'express';
import prisma from './src/index.js';
import userRoutes from './routes/user.routes.js';
import dotenv from 'dotenv';
import trainingPlanRoutes from './routes/plan.routes.js';
import sessionRoutes from './routes/session.routes.js';
import nutritionRoutes from './routes/nutrition.routes.js';
import weekRoutes from './routes/week.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';


const app = express();

app.use(cors({
  origin: ['http://localhost:5000', 'http://127.0.0.1:5000'],
  credentials: true
}));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log('🍪 Cookies reçus:', req.cookies);
  console.log('📝 Headers:', req.headers);
  next();
});
app.use(express.static('frontend'));
app.use(express.json())

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/training-plans', trainingPlanRoutes);
app.use('/sessions', sessionRoutes);
app.use('/nutrition', nutritionRoutes);
app.use('/weeks', weekRoutes);

dotenv.config();

export default app;