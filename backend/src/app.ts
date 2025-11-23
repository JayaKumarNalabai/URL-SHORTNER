import express, { Express } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { logger } from './utils/logger';
import { apiRateLimiter, redirectRateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import healthRoutes from './routes/healthRoutes';
import authRoutes from './routes/authRoutes';
import urlRoutes from './routes/urlRoutes';
import adminRoutes from './routes/adminRoutes';
import { redirectUrl } from './controllers/urlController';

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(
  cors({
    origin: '*', // Allow all origins (development only)
    credentials: false,
  })
);

// API routes
app.use('/api', apiRateLimiter);
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/admin', adminRoutes);

// Redirect route (outside /api, with its own rate limiter)
// Must be after API routes to avoid catching /api paths
app.get('/:shortId', redirectRateLimiter, redirectUrl);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

