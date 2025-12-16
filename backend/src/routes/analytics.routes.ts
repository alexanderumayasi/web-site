import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/auth';
import prisma from '../utils/prisma';

const router = Router();

// Get dashboard analytics
router.get('/dashboard', authenticate, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
      recentOrders,
      topProducts,
      salesByDay,
    ] = await Promise.all([
      // Total orders
      prisma.order.count(),

      // Total revenue
      prisma.order.aggregate({
        where: { paymentStatus: 'COMPLETED' },
        _sum: { total: true },
      }),

      // Total customers
      prisma.user.count({ where: { role: 'CUSTOMER' } }),

      // Total products
      prisma.product.count({ where: { isActive: true } }),

      // Recent orders (last 10)
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),

      // Top selling products
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true,
          total: true,
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: 5,
      }),

      // Sales by day (last 30 days)
      prisma.$queryRaw`
        SELECT 
          DATE(o."createdAt") as date,
          SUM(o.total) as revenue,
          COUNT(*)::int as orders
        FROM "Order" o
        WHERE 
          o."createdAt" >= ${thirtyDaysAgo}
          AND o."paymentStatus" = 'COMPLETED'
        GROUP BY DATE(o."createdAt")
        ORDER BY DATE(o."createdAt") ASC
      ` as Promise<Array<{ date: Date; revenue: number; orders: number }>>,
    ]);

    // Get product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            images: true,
            price: true,
          },
        });

        return {
          ...product,
          totalSold: item._sum.quantity,
          revenue: item._sum.total,
        };
      })
    );

    // Format sales by day
    const salesChartData = salesByDay.map((day) => ({
      date: day.date instanceof Date ? day.date.toISOString().split('T')[0] : day.date,
      revenue: Number(day.revenue || 0),
      orders: Number(day.orders || 0),
    }));

    res.json({
      summary: {
        totalOrders,
        totalRevenue: Number(totalRevenue._sum.total || 0),
        totalCustomers,
        totalProducts,
      },
      recentOrders,
      topProducts: topProductsWithDetails,
      salesChartData,
    });
  } catch (error) {
    next(error);
  }
});

// Get sales report
router.get('/sales', authenticate, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const { startDate, endDate } = req.query;

    const where: any = {
      paymentStatus: 'COMPLETED',
    };

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const [orders, revenue] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),

      prisma.order.aggregate({
        where,
        _sum: {
          total: true,
          subtotal: true,
          tax: true,
          shipping: true,
          discount: true,
        },
        _count: true,
      }),
    ]);

    res.json({
      orders,
      summary: {
        totalOrders: revenue._count,
        totalRevenue: Number(revenue._sum.total || 0),
        totalSubtotal: Number(revenue._sum.subtotal || 0),
        totalTax: Number(revenue._sum.tax || 0),
        totalShipping: Number(revenue._sum.shipping || 0),
        totalDiscount: Number(revenue._sum.discount || 0),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
