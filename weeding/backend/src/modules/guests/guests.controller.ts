import { Response, NextFunction } from 'express';
import prisma from '../../config/db';
import { AppError } from '../../shared/errorHandler';
import { AuthRequest } from '../../shared/middlewares';

export const addGuest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { invitationId, name, address, code } = req.body;

    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    if (!invitationId || !name) {
      return next(new AppError('InvitationId and name are required', 400));
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id: BigInt(invitationId) },
    });

    if (!invitation) {
      return next(new AppError('Invitation not found', 404));
    }

    // Auth check
    if (invitation.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Forbidden: You do not own this invitation', 403));
    }

    // Generate unique guest code if not provided
    const guestCode = code || `${name.toUpperCase().replace(/\s+/g, '-')}-${Math.round(Math.random() * 1000)}`;
    const qrToken = `qr-${guestCode}-${Math.round(Math.random() * 1e6)}`;

    const guest = await prisma.guest.create({
      data: {
        invitationId: BigInt(invitationId),
        name,
        address,
        code: guestCode,
        qrToken,
      },
    });

    res.status(201).json({
      status: 'success',
      data: { guest },
    });
  } catch (error) {
    next(error);
  }
};

export const getGuestList = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { invitationId } = req.params;

    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id: BigInt(invitationId) },
    });

    if (!invitation) {
      return next(new AppError('Invitation not found', 404));
    }

    // Auth check
    if (invitation.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Forbidden: You do not own this invitation', 403));
    }

    const guests = await prisma.guest.findMany({
      where: { invitationId: BigInt(invitationId) },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      data: { guests },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyQr = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { qrToken } = req.body;

    if (!qrToken) {
      return next(new AppError('QR Token is required', 400));
    }

    const guest = await prisma.guest.findFirst({
      where: { qrToken },
      include: {
        invitation: true,
      },
    });

    if (!guest) {
      return next(new AppError('Guest not found with this QR Token', 404));
    }

    if (guest.isAttended) {
      return res.status(200).json({
        status: 'success',
        message: 'Tamu sudah melakukan check-in sebelumnya',
        data: { guest },
      });
    }

    const updatedGuest = await prisma.guest.update({
      where: { id: guest.id },
      data: { isAttended: true },
      include: {
        invitation: true,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Check-in berhasil dilakukan!',
      data: { guest: updatedGuest },
    });
  } catch (error) {
    next(error);
  }
};
