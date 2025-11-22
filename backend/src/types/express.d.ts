import { IUrl } from '../models/Url';

declare global {
  namespace Express {
    interface Request {
      url?: IUrl;
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export {};

