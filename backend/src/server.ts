import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import orderRoutes from './routes/order.routes';
import userRoutes from './routes/user.routes';
import couponRoutes from './routes/coupon.routes';
import reviewRoutes from './routes/review.routes';
import uploadRoutes from './routes/upload.routes';
import cartRoutes from './routes/cart.routes';
import analyticsRoutes from './routes/analytics.routes';
import chatbotRoutes from './routes/chatbot.routes';
import paymentPinRoutes from './routes/payment-pin.routes';
import stripeRoutes from './routes/stripe.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Evitar respuestas 304 en desarrollo y problemas con $fetch cuando hay ETag
// Deshabilitamos ETag y forzamos no-cache en todas las respuestas API
app.set('etag', false);
app.use(helmet());
// CORS: permitir orígenes comunes en desarrollo
const defaultOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3100',
  'http://127.0.0.1:3100',
];
const configuredOrigin = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [];
const allowlist = Array.from(new Set([...defaultOrigins, ...configuredOrigin]));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // permitir herramientas como curl/postman
    if (allowlist.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: Origin no permitido (${origin})`));
  },
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// No-cache para evitar 304 (sin cuerpo) que rompen ofetch en el frontend durante dev
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payment-pin', paymentPinRoutes);
app.use('/api/stripe', stripeRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
});

export default app;
