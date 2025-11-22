import { Request, Response, NextFunction } from 'express';
import { Url, IUrl } from '../models/Url';
import { generateShortId } from '../utils/generateShortId';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/authMiddleware';
import { z } from 'zod';
import { env } from '../config/env';
import mongoose from 'mongoose';

const createUrlSchema = z.object({
  originalUrl: z.string().url('Invalid URL format'),
  title: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const updateUrlSchema = z.object({
  originalUrl: z.string().url('Invalid URL format').optional(),
  title: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export const createUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      const error: AppError = new Error('Unauthorized');
      error.statusCode = 401;
      return next(error);
    }

    const { originalUrl, title, tags } = createUrlSchema.parse(req.body);

    const shortId = await generateShortId();
    const baseUrl = `http://localhost:${env.port}`;
    const shortUrl = `${baseUrl}/${shortId}`;

    const url = new Url({
      shortId,
      originalUrl,
      title: title || '',
      tags: tags || [],
      isActive: true,
      owner: new mongoose.Types.ObjectId(userId),
    });

    await url.save();

    res.status(201).json({
      success: true,
      data: {
        id: url._id,
        shortId: url.shortId,
        shortUrl,
        originalUrl: url.originalUrl,
        title: url.title,
        tags: url.tags,
        clicks: url.clicks,
        createdAt: url.createdAt,
        isActive: url.isActive,
      },
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
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      const error: AppError = new Error('Unauthorized');
      error.statusCode = 401;
      return next(error);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';

    const skip = (page - 1) * limit;

    const query: any = {
      owner: new mongoose.Types.ObjectId(userId),
    };
    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    const [urls, totalItems] = await Promise.all([
      Url.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Url.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalItems / limit);
    const baseUrl = `http://localhost:${env.port}`;

    res.json({
      success: true,
      data: urls.map((url) => ({
        id: url._id,
        shortId: url.shortId,
        shortUrl: `${baseUrl}/${url.shortId}`,
        originalUrl: url.originalUrl,
        title: url.title,
        tags: url.tags,
        clicks: url.clicks,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
        lastAccessedAt: url.lastAccessedAt,
        isActive: url.isActive,
      })),
      pagination: {
        page,
        limit,
        totalPages,
        totalItems,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUrlById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      const error: AppError = new Error('Unauthorized');
      error.statusCode = 401;
      return next(error);
    }

    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const error: AppError = new Error('Invalid URL ID format');
      error.statusCode = 400;
      return next(error);
    }

    const url = await Url.findOne({
      _id: id,
      owner: new mongoose.Types.ObjectId(userId),
    });

    if (!url) {
      const error: AppError = new Error('URL not found');
      error.statusCode = 404;
      return next(error);
    }

    const baseUrl = `http://localhost:${env.port}`;

    res.json({
      success: true,
      data: {
        id: url._id,
        shortId: url.shortId,
        shortUrl: `${baseUrl}/${url.shortId}`,
        originalUrl: url.originalUrl,
        title: url.title,
        tags: url.tags,
        clicks: url.clicks,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
        lastAccessedAt: url.lastAccessedAt,
        isActive: url.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUrlStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      const error: AppError = new Error('Unauthorized');
      error.statusCode = 401;
      return next(error);
    }

    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const error: AppError = new Error('Invalid URL ID format');
      error.statusCode = 400;
      return next(error);
    }

    const url = await Url.findOne({
      _id: id,
      owner: new mongoose.Types.ObjectId(userId),
    });

    if (!url) {
      const error: AppError = new Error('URL not found');
      error.statusCode = 404;
      return next(error);
    }

    const baseUrl = `http://localhost:${env.port}`;

    res.json({
      success: true,
      data: {
        id: url._id,
        shortId: url.shortId,
        shortUrl: `${baseUrl}/${url.shortId}`,
        originalUrl: url.originalUrl,
        title: url.title,
        totalClicks: url.clicks,
        createdAt: url.createdAt,
        lastAccessedAt: url.lastAccessedAt,
        isActive: url.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      const error: AppError = new Error('Unauthorized');
      error.statusCode = 401;
      return next(error);
    }

    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const error: AppError = new Error('Invalid URL ID format');
      error.statusCode = 400;
      return next(error);
    }

    const updateData = updateUrlSchema.parse(req.body);

    const url = await Url.findOneAndUpdate(
      {
        _id: id,
        owner: new mongoose.Types.ObjectId(userId),
      },
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!url) {
      const error: AppError = new Error('URL not found');
      error.statusCode = 404;
      return next(error);
    }

    const baseUrl = `http://localhost:${env.port}`;

    res.json({
      success: true,
      data: {
        id: url._id,
        shortId: url.shortId,
        shortUrl: `${baseUrl}/${url.shortId}`,
        originalUrl: url.originalUrl,
        title: url.title,
        tags: url.tags,
        clicks: url.clicks,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
        lastAccessedAt: url.lastAccessedAt,
        isActive: url.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      const error: AppError = new Error('Unauthorized');
      error.statusCode = 401;
      return next(error);
    }

    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const error: AppError = new Error('Invalid URL ID format');
      error.statusCode = 400;
      return next(error);
    }

    const url = await Url.findOneAndDelete({
      _id: id,
      owner: new mongoose.Types.ObjectId(userId),
    });

    if (!url) {
      const error: AppError = new Error('URL not found');
      error.statusCode = 404;
      return next(error);
    }

    res.json({
      success: true,
      message: 'URL deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const redirectUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { shortId } = req.params;

    const url = await Url.findOne({ shortId, isActive: true });

    if (!url) {
      res.status(404).json({
        message: 'Short URL not found or inactive',
        statusCode: 404,
      });
      return;
    }

    url.clicks += 1;
    url.lastAccessedAt = new Date();
    await url.save();

    res.redirect(307, url.originalUrl);
  } catch (error) {
    next(error);
  }
};

