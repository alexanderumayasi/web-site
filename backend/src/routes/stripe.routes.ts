import { Router } from 'express';
import Stripe from 'stripe';
import { authenticate } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import prisma from '../utils/prisma';

const router = Router();

// Inicializar Stripe con clave de test
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Crear Payment Intent
router.post('/create-payment-intent', authenticate, async (req: any, res: any, next: any) => {
  try {
    const { orderId } = req.body;

    let amountInCents = 0;
    let description = 'Gaming Store payment intent';
    const metadata: Record<string, string> = {
      userId: req.user.id,
      customerEmail: req.user.email,
    };
    let order: any = null;

    if (orderId) {
      order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        throw createError('Order not found', 404);
      }

      if (order.userId !== req.user.id) {
        throw createError('Unauthorized', 403);
      }

      amountInCents = Math.round(Number(order.total) * 100);
      description = `Order #${order.orderNumber}`;
      metadata.orderId = order.id;
      metadata.orderNumber = order.orderNumber;
    } else {
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

      const subtotal = cart.items.reduce((sum: number, item: any) => {
        return sum + Number(item.product.price) * item.quantity;
      }, 0);

      const tax = subtotal * 0.18; // IGV 18%
      const shipping = subtotal > 100 ? 0 : 10;
      const total = subtotal + tax + shipping;

      amountInCents = Math.round(total * 100);
      metadata.cartItems = cart.items.length.toString();
      description = 'Gaming Store checkout payment';
    }

    if (amountInCents <= 0) {
      throw createError('Invalid amount for payment intent', 400);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
      description,
    });

    if (order) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          stripePaymentId: paymentIntent.id,
          paymentStatus: 'PENDING',
        },
      });
    }

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amountInCents / 100,
    });
  } catch (error) {
    next(error);
  }
});

// Actualizar estado de orden después de pago exitoso
router.post('/payment-success', authenticate, async (req: any, res: any, next: any) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    if (!orderId) {
      throw createError('Order ID is required', 400);
    }

    if (!paymentIntentId) {
      throw createError('Payment Intent ID is required', 400);
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw createError('Payment not completed', 400);
    }

    if (paymentIntent.metadata.orderId !== orderId) {
      throw createError('Payment intent does not belong to this order', 400);
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PROCESSING',
        paymentStatus: 'COMPLETED',
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
