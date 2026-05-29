import { Response, NextFunction } from 'express';
import prisma from '../../config/db';
import { AppError } from '../../shared/errorHandler';
import { AuthRequest } from '../../shared/middlewares';

export const createRsvp = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { invitationId, name, attendance, guestCount, message } = req.body;

    if (!invitationId || !name || attendance === undefined) {
      return next(new AppError('InvitationId, name, and attendance status are required', 400));
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id: BigInt(invitationId) },
    });

    if (!invitation) {
      return next(new AppError('Invitation not found', 404));
    }

    let attendanceStatus: 'hadir' | 'tidak_hadir' | 'ragu' = 'ragu';
    if (attendance === true || attendance === 'true' || attendance === 'hadir') {
      attendanceStatus = 'hadir';
    } else if (attendance === false || attendance === 'false' || attendance === 'tidak_hadir') {
      attendanceStatus = 'tidak_hadir';
    }

    const isAttending = attendanceStatus === 'hadir';

    const rsvp = await prisma.rsvp.create({
      data: {
        invitationId: BigInt(invitationId),
        name,
        attendance: attendanceStatus,
        guestCount: isAttending ? Number(guestCount) || 1 : 0,
        message,
      },
    });

    res.status(201).json({
      status: 'success',
      data: { rsvp },
    });
  } catch (error) {
    next(error);
  }
};

export const getRsvpsByInvitation = async (req: AuthRequest, res: Response, next: NextFunction) => {
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

    const rsvps = await prisma.rsvp.findMany({
      where: { invitationId: BigInt(invitationId) },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      data: { rsvps },
    });
  } catch (error) {
    next(error);
  }
};
