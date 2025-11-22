import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { AppError } from './errorHandler';

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authReq = req as AuthRequest;
  
  if (!authReq.user || authReq.user.role !== 'admin') {
    const error: AppError = new Error('Admin access only');
    error.statusCode = 403;
    return next(error);
  }

  next();
};

