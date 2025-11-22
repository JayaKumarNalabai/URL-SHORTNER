import morgan from 'morgan';
import { Request, Response } from 'express';

const format = ':method :url :status :response-time ms';

export const logger = morgan(format, {
  skip: (req: Request, res: Response) => {
    return req.path === '/api/health';
  },
});

