import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import prisma from '../utils/prisma';

const router = Router();

// Get product reviews
router.get('/product/:productId', async (req: any, res: any, next: any) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        productId: req.params.productId,
        isPublished: true,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

// Create review
router.post('/', authenticate, async (req: any, res: any, next: any) => {
  try {
    const { productId, rating, title, comment } = req.body;

    // Check if user has purchased the product
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: req.user.id,
          paymentStatus: 'COMPLETED',
        },
      },
    });

    const review = await prisma.review.create({
      data: {
        productId,
        userId: req.user.id,
        rating,
        title,
        comment,
        isVerified: !!hasPurchased,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
});

// Update review
router.put('/:id', authenticate, async (req: any, res: any, next: any) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: req.params.id },
    });

    if (!review) {
      throw createError('Review not found', 404);
    }

    if (review.userId !== req.user.id) {
      throw createError('Unauthorized', 403);
    }

    const updated = await prisma.review.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Delete review
router.delete('/:id', authenticate, async (req: any, res: any, next: any) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: req.params.id },
    });

    if (!review) {
      throw createError('Review not found', 404);
    }

    if (review.userId !== req.user.id && req.user.role !== 'ADMIN') {
      throw createError('Unauthorized', 403);
    }

    await prisma.review.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
