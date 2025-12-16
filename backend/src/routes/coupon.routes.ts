import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/auth';
import prisma from '../utils/prisma';

const router = Router();

// Get all coupons (admin)
router.get('/', authenticate, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json(coupons);
  } catch (error) {
    next(error);
  }
});

// Validate coupon
router.post('/validate', authenticate, async (req: any, res: any, next: any) => {
  try {
    const { code } = req.body;

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return res.status(404).json({ error: 'Cupón no encontrado' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ error: 'Este cupón no está activo' });
    }

    const now = new Date();
    if (now < coupon.startDate) {
      return res.status(400).json({ error: 'Este cupón aún no está disponible' });
    }

    if (now > coupon.endDate) {
      return res.status(400).json({ error: 'Este cupón ha expirado' });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ error: 'Este cupón ha alcanzado su límite de uso' });
    }

    res.json({
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: Number(coupon.discountValue),
      minPurchase: coupon.minPurchase ? Number(coupon.minPurchase) : null,
      maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
    });
  } catch (error) {
    next(error);
  }
});

// Create coupon (admin)
router.post('/', authenticate, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const coupon = await prisma.coupon.create({
      data: req.body,
    });

    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
});

// Update coupon (admin)
router.put('/:id', authenticate, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const coupon = await prisma.coupon.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(coupon);
  } catch (error) {
    next(error);
  }
});

// Delete coupon (admin)
router.delete('/:id', authenticate, isAdmin, async (req: any, res: any, next: any) => {
  try {
    await prisma.coupon.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
