// backend/src/routes/auth.routes.ts
import { Router } from 'express';
import { login, register, getProfile } from '@/controllers/auth.controller';
import { protect } from '@/middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile', protect, getProfile);

export default router;