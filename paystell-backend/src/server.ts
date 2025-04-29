import 'reflect-metadata'; // Required for TypeORM
import dotenv from 'dotenv';
import app from './app';
import { initializeDatabase } from './utils/database';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Start server
async function startServer() {
  try {
    // Initialize database connection
    await initializeDatabase();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...', err);
  process.exit(1);
});

startServer();