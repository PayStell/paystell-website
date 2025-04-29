import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorMiddleware } from './middlewares/error.middleware';
import { setupWalletVerificationRoutes } from './modules/wallet/routes/wallet-verification.routes';
import { setupAuthRoutes } from './modules/auth/routes/auth.routes';
import { setupSwagger } from './utils/swagger';

const app = express();
// Middleware
app.use(helmet()); 
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(morgan('dev')); 



// API routes
const apiPrefix = process.env.API_PREFIX || '/api';
app.use(`${apiPrefix}/wallet-verification`, setupWalletVerificationRoutes());
app.use(`${apiPrefix}/auth`, setupAuthRoutes());


// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Error handling middleware
app.use(errorMiddleware);

export default app;