import { Router } from 'express';
import { uploadFile } from './uploads.controller';
import { dynamicUpload } from './multer';
import { authenticate } from '../../shared/middlewares';

const router = Router();

// Protected: upload file dynamically to covers, galleries, music, or profiles
router.post('/:type', authenticate as any, dynamicUpload as any, uploadFile as any);

export default router;
