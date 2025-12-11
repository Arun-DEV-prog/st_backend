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
// import userRoutes from './routes/userRoutes';
// app.use('/api/users', userRoutes);

export default app;
