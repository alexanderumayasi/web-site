import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { createError } from '../middleware/errorHandler';
import prisma from '../utils/prisma';

const router = Router();

// Almacén temporal de PINs (en producción usar Redis)
const pinStore = new Map<string, { pin: string; email: string; orderId: string; expiresAt: Date; attempts: number }>();

// Generar PIN de 6 dígitos
const generatePIN = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Enviar PIN al email del usuario
router.post(
  '/send-pin',
  authenticate,
  validate([
    body('orderId').notEmpty(),
    body('amount').isNumeric(),
  ]),
  async (req: any, res: any, next: any) => {
    try {
      const { orderId, amount } = req.body;
      const userId = req.user.id;

      // Obtener información del usuario
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      });

      if (!user) {
        throw createError('Usuario no encontrado', 404);
      }

      // Generar PIN
      const pin = generatePIN();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

      // Guardar PIN en el almacén temporal
      const pinId = `pin_${userId}_${Date.now()}`;
      pinStore.set(pinId, {
        pin,
        email: user.email,
        orderId,
        expiresAt,
        attempts: 0,
      });

      // Simular envío de email (en producción usar servicio como SendGrid, Nodemailer, etc.)
      console.log('📧 Email enviado a:', user.email);
      console.log('🔐 PIN:', pin);
      console.log('⏰ Expira en: 10 minutos');

      // En desarrollo, devolver el PIN en la respuesta para pruebas
      const isDevelopment = process.env.NODE_ENV === 'development';

      res.json({
        success: true,
        message: 'PIN enviado a tu correo electrónico',
        pinId,
        expiresAt,
        ...(isDevelopment && { devPin: pin }), // Solo en desarrollo
      });
    } catch (error) {
      next(error);
    }
  }
);

// Verificar PIN
router.post(
  '/verify-pin',
  authenticate,
  validate([
    body('pinId').notEmpty(),
    body('pin').isLength({ min: 6, max: 6 }),
  ]),
  async (req: any, res: any, next: any) => {
    try {
      const { pinId, pin } = req.body;
      const userId = req.user.id;

      const pinData = pinStore.get(pinId);

      if (!pinData) {
        throw createError('PIN no encontrado o ha expirado', 404);
      }

      // Verificar expiración
      if (new Date() > pinData.expiresAt) {
        pinStore.delete(pinId);
        throw createError('PIN expirado. Solicita uno nuevo', 400);
      }

      // Verificar intentos
      if (pinData.attempts >= 3) {
        pinStore.delete(pinId);
        throw createError('Demasiados intentos fallidos. Solicita un nuevo PIN', 400);
      }

      // Verificar PIN
      if (pinData.pin !== pin) {
        pinData.attempts += 1;
        pinStore.set(pinId, pinData);
        throw createError(`PIN incorrecto. Intentos restantes: ${3 - pinData.attempts}`, 400);
      }

      // PIN correcto - actualizar orden
      const order = await prisma.order.findUnique({
        where: { id: pinData.orderId },
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        throw createError('Orden no encontrada', 404);
      }

      if (order.userId !== userId) {
        throw createError('No autorizado', 403);
      }

      // Actualizar estado de la orden
      const updatedOrder = await prisma.order.update({
        where: { id: pinData.orderId },
        data: {
          paymentStatus: 'COMPLETED',
          status: 'PROCESSING',
        },
      });

      // Eliminar PIN usado
      pinStore.delete(pinId);

      // Generar ID de transacción
      const transactionId = `TXN_PIN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      res.json({
        success: true,
        message: 'Pago verificado exitosamente',
        transactionId,
        order: updatedOrder,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Limpiar PINs expirados cada 5 minutos
setInterval(() => {
  const now = new Date();
  for (const [key, value] of pinStore.entries()) {
    if (now > value.expiresAt) {
      pinStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export default router;
