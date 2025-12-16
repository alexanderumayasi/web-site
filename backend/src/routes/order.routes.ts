import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import prisma from '../utils/prisma';

const router = Router();

// Get user's own orders (non-admin specific)
router.get('/my-orders', authenticate, async (req: any, res: any, next: any) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
                sku: true,
              },
            },
          },
        },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// Get user's orders
router.get('/', authenticate, async (req: any, res: any, next: any) => {
  try {
    const where: any = {};

    if (req.user.role !== 'ADMIN') {
      where.userId = req.user.id;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// Get single order
router.get('/:id', authenticate, async (req: any, res: any, next: any) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        coupon: true,
      },
    });

    if (!order) {
      throw createError('Order not found', 404);
    }

    if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
      throw createError('Unauthorized', 403);
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
});

// Create order
router.post('/', authenticate, async (req: any, res: any, next: any) => {
  try {
    const { shippingAddress, paymentMethod, couponCode } = req.body;

    // Check for recent duplicate orders (within last 2 minutes)
    const recentOrder = await prisma.order.findFirst({
      where: {
        userId: req.user.id,
        createdAt: {
          gte: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (recentOrder) {
      throw createError('Por favor espera antes de realizar otra compra', 429);
    }

    // Get cart items
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw createError('Cart is empty', 400);
    }

    // Verify stock availability for all products
    for (const item of cart.items) {
      if (!item.product.isActive) {
        throw createError(`El producto "${item.product.name}" ya no está disponible`, 400);
      }
      if (item.product.stock < item.quantity) {
        throw createError(
          `Stock insuficiente para "${item.product.name}". Solo quedan ${item.product.stock} unidades disponibles`,
          400
        );
      }
    }

    // Validate or create address
    let address: any = null;
    if (shippingAddress) {
      // Create new address from shipping info
      address = await prisma.address.create({
        data: {
          userId: req.user.id,
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          phone: shippingAddress.phone,
          street: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          isDefault: false,
        },
      });
    }

    // Handle coupon
    let coupon: any = null;
    if (couponCode) {
      coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (!coupon || !coupon.isActive || new Date() > coupon.endDate) {
        throw createError('Invalid coupon', 400);
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum: number, item: any) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    let discount = 0;
    if (coupon) {
      if (coupon.discountType === 'percentage') {
        discount = (subtotal * Number(coupon.discountValue)) / 100;
        if (coupon.maxDiscount) {
          discount = Math.min(discount, Number(coupon.maxDiscount));
        }
      } else {
        discount = Number(coupon.discountValue);
      }
    }

    const tax = (subtotal - discount) * 0.18; // 18% IGV (Perú)
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal - discount + tax + shipping;

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Use transaction to ensure atomicity
    const order = await prisma.$transaction(async (tx) => {
      // Create order with PENDING status (will be updated when payment succeeds)
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: req.user.id,
          addressId: address?.id,
          couponId: coupon?.id,
          subtotal,
          discount,
          tax,
          shipping,
          total,
          status: 'PENDING', // Will change to PROCESSING after payment
          paymentStatus: 'PENDING',
          notes: shippingAddress?.notes,
          items: {
            create: cart.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
              total: Number(item.product.price) * item.quantity,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          address: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      // Update stock
      for (const item of cart.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true },
        });

        // Double-check stock (race condition protection)
        if (!product || product.stock < item.quantity) {
          throw createError(
            `Stock insuficiente para completar la orden. Por favor actualiza tu carrito.`,
            400
          );
        }

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      // Update coupon usage
      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: {
            usageCount: {
              increment: 1,
            },
          },
        });
      }

      return newOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

// Update order status (admin)
router.patch('/:id/status', authenticate, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const { status } = req.body;

    // Determinar si el estado implica que el pago debe estar completado
    const updateData: any = { status };
    
    // Si el pedido está en PROCESSING, SHIPPED o DELIVERED, marcar el pago como COMPLETED
    if (['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(status)) {
      updateData.paymentStatus = 'COMPLETED';
    }
    
    // Si el pedido es CANCELLED o REFUNDED, marcar el pago según corresponda
    if (status === 'CANCELLED') {
      updateData.paymentStatus = 'FAILED';
    }
    
    if (status === 'REFUNDED') {
      updateData.paymentStatus = 'REFUNDED';
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(order);
  } catch (error) {
    next(error);
  }
});

export default router;
