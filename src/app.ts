import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import 'reflect-metadata';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

// API routes will be imported here
import specialistsRoutes from './routes/specialists.routes';
app.use('/api/specialists', specialistsRoutes);

export default app;
