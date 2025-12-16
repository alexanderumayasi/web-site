import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import prisma from '../utils/prisma';

const router = Router();

// Get user's cart
router.get('/', authenticate, async (req: any, res: any, next: any) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: req.user.id,
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });
    }

    res.json(cart);
  } catch (error) {
    next(error);
  }
});

// Add item to cart
router.post('/items', authenticate, async (req: any, res: any, next: any) => {
  try {
    const { productId, quantity } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      throw createError('Product not found', 404);
    }

    if (product.stock < quantity) {
      throw createError('Insufficient stock', 400);
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
      });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw createError('Insufficient stock', 400);
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
});

// Update cart item quantity
router.put('/items/:productId', authenticate, async (req: any, res: any, next: any) => {
  try {
    const { quantity } = req.body;

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (!cart) {
      throw createError('Cart not found', 404);
    }

    const product = await prisma.product.findUnique({
      where: { id: req.params.productId },
    });

    if (!product || product.stock < quantity) {
      throw createError('Insufficient stock', 400);
    }

    await prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: req.params.productId,
        },
      },
      data: { quantity },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
});

// Remove item from cart
router.delete('/items/:productId', authenticate, async (req: any, res: any, next: any) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (!cart) {
      throw createError('Cart not found', 404);
    }

    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: req.params.productId,
        },
      },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
});

// Clear cart
router.delete('/', authenticate, async (req: any, res: any, next: any) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
});

export default router;
