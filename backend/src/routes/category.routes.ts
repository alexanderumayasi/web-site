import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/auth';
import prisma from '../utils/prisma';

const router = Router();

// Get all categories
router.get('/', async (req: any, res: any, next: any) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// Get category by slug
router.get('/:slug', async (req: any, res: any, next: any) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: {
        products: {
          where: { isActive: true },
          take: 12,
        },
      },
    });

    res.json(category);
  } catch (error) {
    next(error);
  }
});

// Create category (admin)
router.post('/', authenticate, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const category = await prisma.category.create({
      data: req.body,
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

// Update category (admin)
router.put('/:id', authenticate, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(category);
  } catch (error) {
    next(error);
  }
});

// Delete category (admin)
router.delete('/:id', authenticate, isAdmin, async (req: any, res: any, next: any) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
