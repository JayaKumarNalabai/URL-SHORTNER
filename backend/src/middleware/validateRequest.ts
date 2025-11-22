import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { AppError } from './errorHandler';

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors.map((e) => e.message).join(', ');
        const validationError: AppError = new Error(errorMessage);
        validationError.statusCode = 400;
        next(validationError);
      } else {
        next(error);
      }
    }
  };
};

