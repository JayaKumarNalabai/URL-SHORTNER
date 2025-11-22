import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error: AppError = new Error('No token provided');
      error.statusCode = 401;
      return next(error);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = jwt.verify(token, env.jwtSecret) as {
        id: string;
        email: string;
        role: string;
      };

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role || 'user',
      };

      next();
    } catch (jwtError) {
      const error: AppError = new Error('Invalid or expired token');
      error.statusCode = 401;
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};

