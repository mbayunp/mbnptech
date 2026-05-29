import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errorHandler';
import { uploadImage } from './cloudinary.service';

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new AppError('Berkas tidak ditemukan untuk diunggah', 400));
    }

    const { type } = req.params;
    
    // Validate category type
    const allowedTypes = ['covers', 'galleries', 'music', 'profiles'];
    if (!type || !allowedTypes.includes(type)) {
      return next(new AppError('Kategori unggah berkas tidak valid', 400));
    }

    // Call Cloudinary / Local upload service with specific category type
    const fileUrl = await uploadImage(req.file.buffer, req.file.originalname, type);

    res.status(201).json({
      status: 'success',
      data: {
        url: fileUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};
