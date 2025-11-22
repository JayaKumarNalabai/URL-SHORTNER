import { Router } from 'express';
import {
  createUrl,
  getUrls,
  getUrlById,
  getUrlStats,
  updateUrl,
  deleteUrl,
  redirectUrl,
} from '../controllers/urlController';
import { validateRequest } from '../middleware/validateRequest';
import { authMiddleware } from '../middleware/authMiddleware';
import { z } from 'zod';

const router = Router();

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

// All URL routes require authentication
router.use(authMiddleware);

router.post('/', validateRequest(createUrlSchema), createUrl);
router.get('/', getUrls);
router.get('/:id', getUrlById);
router.get('/:id/stats', getUrlStats);
router.patch('/:id', validateRequest(updateUrlSchema), updateUrl);
router.delete('/:id', deleteUrl);

export default router;

