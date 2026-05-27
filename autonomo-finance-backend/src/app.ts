import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import userRoutes from './routes/userRoute';

const app = express();

app.use(morgan("tiny"));

app.use(cors({
  origin: [
    'http://localhost:3000',
    // 'https://seu-frontend.vercel.app', // ← adiciona quando fizer deploy do front
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(helmet());

app.use(express.json());

app.use('/api', userRoutes);

export default app;