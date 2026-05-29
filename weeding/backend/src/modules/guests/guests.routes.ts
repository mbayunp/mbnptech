import { Router } from 'express';
import { addGuest, getGuestList, verifyQr } from './guests.controller';
import { authenticate } from '../../shared/middlewares';

const router = Router();

// Protected: Guest management
router.post('/', authenticate as any, addGuest as any);
router.get('/invitation/:invitationId', authenticate as any, getGuestList as any);
router.post('/verify-qr', authenticate as any, verifyQr as any);

export default router;
