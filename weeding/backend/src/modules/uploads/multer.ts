import multer from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errorHandler';

// Allowed MIME types and extensions
const ALLOWED_IMAGES = {
  mime: /image\/(jpeg|jpg|png|webp)/,
  ext: /jpeg|jpg|png|webp/
};

const ALLOWED_AUDIO = {
  mime: /audio\/(mpeg|mp3|x-mpeg|x-mp3|mpeg3|x-mpeg3|mpg|x-mpg|x-mpegaudio)/,
  ext: /mp3/
};

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const cleanUrl = req.originalUrl.split('?')[0];
  const type = cleanUrl.split('/').pop() || '';
  const isAudio = type === 'music';

  const rules = isAudio ? ALLOWED_AUDIO : ALLOWED_IMAGES;
  const ext = rules.ext.test(path.extname(file.originalname).toLowerCase());
  const mime = rules.mime.test(file.mimetype.toLowerCase());

  if (ext && mime) {
    cb(null, true);
  } else {
    if (isAudio) {
      cb(new Error('Hanya file audio MP3 yang diperbolehkan (.mp3)'));
    } else {
      cb(new Error('Hanya file gambar JPG, JPEG, PNG, dan WEBP yang diperbolehkan'));
    }
  }
};

// Reusable memory storage multer instance
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
});

/**
 * Express middleware to handle dynamic multer upload with size limits based on folder category
 */
export const dynamicUpload = (req: Request, res: Response, next: NextFunction) => {
  const cleanUrl = req.originalUrl.split('?')[0];
  const type = cleanUrl.split('/').pop() || '';
  const isAudio = type === 'music';
  
  // Audio limit: 15MB, Image limit: 5MB
  const maxLimit = isAudio ? 15 * 1024 * 1024 : 5 * 1024 * 1024;
  
  const singleUpload = upload.single('file');

  singleUpload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError(`File terlalu besar. Maksimal ukuran adalah ${isAudio ? '15MB' : '5MB'}`, 400));
        }
        return next(new AppError(`Kesalahan upload: ${err.message}`, 400));
      }
      return next(new AppError(err.message, 400));
    }
    
    if (!req.file) {
      return next(new AppError('Tidak ada file yang diunggah', 400));
    }
    
    // Add additional validation on file size just to be double safe
    if (req.file.size > maxLimit) {
      return next(new AppError(`File terlalu besar. Maksimal ukuran adalah ${isAudio ? '15MB' : '5MB'}`, 400));
    }

    next();
  });
};
