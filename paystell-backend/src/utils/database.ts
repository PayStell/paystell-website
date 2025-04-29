import { DataSource } from 'typeorm';
import dbConfig from '../config/database.config';

export const AppDataSource = new DataSource(dbConfig);

/**
 * Initialize database connection
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Database connection established successfully');
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

/**
 * Close database connection
 */
export const closeDatabase = async (): Promise<void> => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed successfully');
    }
  } catch (error) {
    console.error('Failed to close database connection:', error);
    throw error;
  }
};
