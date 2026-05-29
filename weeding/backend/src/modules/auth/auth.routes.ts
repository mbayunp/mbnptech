import { Router } from 'express';
import { register, login, me } from './auth.controller';
import { authenticate } from '../../shared/middlewares';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate as any, me as any);

export default router;
