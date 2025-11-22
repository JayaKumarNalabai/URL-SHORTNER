import { IUrl } from '../models/Url';
import { AuthRequest } from '../middleware/authMiddleware';

declare global {
  namespace Express {
    interface Request {
      url?: IUrl;
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export {};

