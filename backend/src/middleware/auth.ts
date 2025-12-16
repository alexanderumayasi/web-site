import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createError } from './errorHandler';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type AuthRequest = Request & {
  // Usamos any para evitar conflicto con posibles augmentations de Express.Request
  user?: any;
};

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw createError('No token provided', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      throw createError('User not found', 401);
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      next(createError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(createError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return next(createError('Access denied. Admin only.', 403));
  }
  next();
};

export const isCustomer = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'CUSTOMER' && req.user?.role !== 'ADMIN') {
    return next(createError('Access denied.', 403));
  }
  next();
};
