import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/authMiddleware';
import { z } from 'zod';
import { env } from '../config/env';

// Strong password validation: min 8 chars, uppercase, lowercase, digit, special char
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().refine(
    (password) => STRONG_PASSWORD_REGEX.test(password),
    {
      message: 'Password does not meet strength requirements. Must be at least 8 characters with uppercase, lowercase, number, and special character.',
    }
  ),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const generateToken = (userId: string, email: string, role: string): string => {
  return jwt.sign(
    { id: userId, email, role },
    env.jwtSecret,
    { expiresIn: '7d' }
  );
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error: AppError = new Error('Email already registered');
      error.statusCode = 400;
      return next(error);
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      email,
      passwordHash,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id.toString(), user.email, user.role);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      const error: AppError = new Error('Invalid email or password');
      error.statusCode = 401;
      return next(error);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      const error: AppError = new Error('Invalid email or password');
      error.statusCode = 401;
      return next(error);
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.email, user.role);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // User is attached by authMiddleware
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      const error: AppError = new Error('Unauthorized');
      error.statusCode = 401;
      return next(error);
    }

    const user = await User.findById(userId);
    if (!user) {
      const error: AppError = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    res.json({
      success: true,
      data: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

