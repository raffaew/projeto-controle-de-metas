import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import userRoutes from './routes/userRoute';

const app = express();

app.use(morgan("tiny"));

app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      'http://localhost:3000',
      'https://projeto-controle-de-metas.vercel.app',
    ]

    // aceita qualquer preview URL da Vercel
    if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(helmet());

app.use(express.json());

app.use('/api', userRoutes);

export default app;