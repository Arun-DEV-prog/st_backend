import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
// Re-export the AppDataSource configured in src/config/database.ts
import { AppDataSource } from './src/config/database';

export default AppDataSource;
