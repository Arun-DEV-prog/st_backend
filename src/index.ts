import 'reflect-metadata';
import dotenv from 'dotenv';
import app from './app';
import { AppDataSource } from './config/database';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✓ Database connection established');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
