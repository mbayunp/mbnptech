import { Router } from 'express';
import {
  createInvitation,
  getInvitationBySubdomain,
  getMyInvitations,
  updateInvitation,
  deleteInvitation,
} from './invitations.controller';
import { authenticate } from '../../shared/middlewares';

const router = Router();

// Public route to resolve invitation by subdomain
router.get('/subdomain/:subdomain', getInvitationBySubdomain as any);

// Protected routes
router.post('/', authenticate as any, createInvitation as any);
router.get('/my', authenticate as any, getMyInvitations as any);
router.put('/:id', authenticate as any, updateInvitation as any);
router.delete('/:id', authenticate as any, deleteInvitation as any);

export default router;
