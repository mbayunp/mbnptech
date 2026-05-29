import { Router } from 'express';
import { createRsvp, getRsvpsByInvitation } from './rsvp.controller';
import { authenticate } from '../../shared/middlewares';

const router = Router();

// Public: RSVP submitting
router.post('/', createRsvp as any);

// Protected: Get RSVP list for a specific invitation
router.get('/invitation/:invitationId', authenticate as any, getRsvpsByInvitation as any);

export default router;
