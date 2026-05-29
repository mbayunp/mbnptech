import { Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import prisma from '../../config/db';
import { AppError } from '../../shared/errorHandler';
import { AuthRequest } from '../../shared/middlewares';

const JWT_SECRET = process.env.JWT_SECRET || 'mbnp_secret_key_production_ready_123!';

export const register = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return next(new AppError('Email, password, and name are required', 400));
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new AppError('Email is already registered', 409));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'user',
      },
    });

    const token = jwt.sign({ id: user.id.toString(), email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Email and password are required', 400));
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Invalid email or password', 401));
    }

    const token = jwt.sign({ id: user.id.toString(), email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    const user = await prisma.user.findUnique({
      where: { id: BigInt(req.user.id) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
