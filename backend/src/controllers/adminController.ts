import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Url } from '../models/Url';
import { AppError } from '../middleware/errorHandler';
import { env } from '../config/env';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find().select('email role createdAt').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users.map((user) => ({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const getUrls = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const urls = await Url.find()
      .populate('owner', 'email')
      .sort({ createdAt: -1 });

    const baseUrl = `http://localhost:${env.port}`;

    res.json({
      success: true,
      data: urls.map((url) => ({
        id: url._id.toString(),
        shortId: url.shortId,
        shortUrl: `${baseUrl}/${url.shortId}`,
        originalUrl: url.originalUrl,
        ownerEmail: url.owner && typeof url.owner === 'object' && 'email' in url.owner
          ? (url.owner as any).email
          : 'Unknown',
        clicks: url.clicks,
        createdAt: url.createdAt,
        isActive: url.isActive,
      })),
    });
  } catch (error) {
    next(error);
  }
};

