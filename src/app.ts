import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'reflect-metadata';
import path from 'path';

const app: Express = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ================= STATIC FILES (IMPORTANT) ================= */
/* 🔥 REQUIRED for uploaded images */
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

/* ================= LOGGING ================= */
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/* ================= HEALTH CHECK ================= */
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/* ================= ROUTES ================= */
import specialistsRoutes from './routes/specialists.routes';

console.log('Registering specialists routes...');
app.use('/api/specialists', specialistsRoutes);
console.log('Specialists routes registered');

/* ================= 404 HANDLER ================= */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
  });
});

/* ================= GLOBAL ERROR HANDLER ================= */
app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Global error handler:', error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
});

export default app;
