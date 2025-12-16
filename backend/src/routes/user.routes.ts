import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import prisma from '../utils/prisma';

const router = Router();

// Get user profile
router.get('/profile', authenticate, async (req: any, res: any, next: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', authenticate, async (req: any, res: any, next: any) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { firstName, lastName, phone },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
      },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Get user addresses
router.get('/addresses', authenticate, async (req: any, res: any, next: any) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: { isDefault: 'desc' },
    });

    res.json(addresses);
  } catch (error) {
    next(error);
  }
});

// Add address
router.post('/addresses', authenticate, async (req: any, res: any, next: any) => {
  try {
    const { isDefault, ...addressData } = req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        ...addressData,
        userId: req.user.id,
        isDefault: isDefault || false,
      },
    });

    res.status(201).json(address);
  } catch (error) {
    next(error);
  }
});

// Update address
router.put('/addresses/:id', authenticate, async (req: any, res: any, next: any) => {
  try {
    const addressCheck = await prisma.address.findUnique({
      where: { id: req.params.id },
    });

    if (!addressCheck || addressCheck.userId !== req.user.id) {
      throw createError('Address not found', 404);
    }

    const { isDefault, ...addressData } = req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id, NOT: { id: req.params.id } },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id: req.params.id },
      data: {
        ...addressData,
        isDefault: isDefault !== undefined ? isDefault : addressCheck.isDefault,
      },
    });

    res.json(address);
  } catch (error) {
    next(error);
  }
});

// Delete address
router.delete('/addresses/:id', authenticate, async (req: any, res: any, next: any) => {
  try {
    const address = await prisma.address.findUnique({
      where: { id: req.params.id },
    });

    if (!address || address.userId !== req.user.id) {
      throw createError('Address not found', 404);
    }

    await prisma.address.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Address deleted' });
  } catch (error) {
    next(error);
  }
});

// Get all users (admin)
router.get('/', authenticate, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

export default router;
