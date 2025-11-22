import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/requireAdmin';
import { getUsers, getUrls } from '../controllers/adminController';

const router = Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(requireAdmin);

router.get('/users', getUsers);
router.get('/urls', getUrls);

export default router;

