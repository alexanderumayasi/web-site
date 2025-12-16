import { Router } from 'express';
import { body, query } from 'express-validator';
import { validate } from '../middleware/validator';
import { authenticate, isAdmin } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import prisma from '../utils/prisma';

const router = Router();

type ProductWhere = Record<string, unknown>;

const getProductsWithMeta = async (
  where: ProductWhere,
  skip: number,
  take: number,
  orderBy: Record<string, unknown>
) => {
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        category: true,
        _count: {
          select: { reviews: true },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const productsWithRating = await Promise.all(
    products.map(async (product) => {
      const reviews = await prisma.review.findMany({
        where: { productId: product.id, isPublished: true },
        select: { rating: true },
      });

      const avgRating = reviews.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      return {
        ...product,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      };
    })
  );

  return {
    products: productsWithRating,
    total,
  };
};

// Get all products (with filters, pagination, search)
router.get(
  '/',
  validate([
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('categoryId').optional().isUUID(),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    query('search').optional().isString(),
    query('sortBy').optional().isIn(['price', 'name', 'createdAt']),
    query('order').optional().isIn(['asc', 'desc']),
    query('isFeatured').optional().isBoolean(),
  ]),
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const skip = (page - 1) * limit;

      const where: ProductWhere = { isActive: true };

      if (req.query.categoryId) {
        where.categoryId = req.query.categoryId;
      }

      if (req.query.search) {
        where.OR = [
          { name: { contains: req.query.search as string, mode: 'insensitive' } },
          { description: { contains: req.query.search as string, mode: 'insensitive' } },
        ];
      }

      if (req.query.minPrice || req.query.maxPrice) {
        where.price = {};
        if (req.query.minPrice) (where.price as any).gte = parseFloat(req.query.minPrice as string);
        if (req.query.maxPrice) (where.price as any).lte = parseFloat(req.query.maxPrice as string);
      }

      if (req.query.isFeatured !== undefined) {
        where.isFeatured = req.query.isFeatured === 'true';
      }

      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const order = (req.query.order as string) || 'desc';

      const { products, total } = await getProductsWithMeta(where, skip, limit, {
        [sortBy]: order,
      });

      res.json({
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: Get products with full visibility
router.get(
  '/admin',
  authenticate,
  isAdmin,
  validate([
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('categoryId').optional().isUUID(),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    query('search').optional().isString(),
    query('sortBy').optional().isIn(['price', 'name', 'createdAt', 'stock']),
    query('order').optional().isIn(['asc', 'desc']),
    query('isFeatured').optional().isBoolean(),
    query('isActive').optional().isBoolean(),
  ]),
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      const where: ProductWhere = {};

      if (req.query.isActive !== undefined) {
        where.isActive = req.query.isActive === 'true';
      }

      if (req.query.categoryId) {
        where.categoryId = req.query.categoryId;
      }

      if (req.query.search) {
        where.OR = [
          { name: { contains: req.query.search as string, mode: 'insensitive' } },
          { description: { contains: req.query.search as string, mode: 'insensitive' } },
          { sku: { contains: req.query.search as string, mode: 'insensitive' } },
        ];
      }

      if (req.query.minPrice || req.query.maxPrice) {
        where.price = {};
        if (req.query.minPrice) (where.price as any).gte = parseFloat(req.query.minPrice as string);
        if (req.query.maxPrice) (where.price as any).lte = parseFloat(req.query.maxPrice as string);
      }

      if (req.query.isFeatured !== undefined) {
        where.isFeatured = req.query.isFeatured === 'true';
      }

      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const order = (req.query.order as string) || 'desc';

      const { products, total } = await getProductsWithMeta(where, skip, limit, {
        [sortBy]: order,
      });

      res.json({
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get single product by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        reviews: {
          where: { isPublished: true },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw createError('Product not found', 404);
    }

    const avgRating = product.reviews.length
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

    res.json({
      ...product,
      averageRating: Math.round(avgRating * 10) / 10,
    });
  } catch (error) {
    next(error);
  }
});

// Create product (admin only)
router.post(
  '/',
  authenticate,
  isAdmin,
  validate([
    body('name').trim().notEmpty(),
    body('slug').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('sku').trim().notEmpty(),
    body('stock').isInt({ min: 0 }),
    body('categoryId').isUUID(),
    body('images').isArray({ min: 1 }),
  ]),
  async (req, res, next) => {
    try {
      const { name, slug, description, price, comparePrice, sku, stock, images, specifications, categoryId, isFeatured } = req.body;

      const existingProduct = await prisma.product.findFirst({
        where: {
          OR: [{ slug }, { sku }],
        },
      });

      if (existingProduct) {
        throw createError('Product with this slug or SKU already exists', 400);
      }

      const product = await prisma.product.create({
        data: {
          name,
          slug,
          description,
          price,
          comparePrice,
          sku,
          stock,
          images,
          specifications,
          categoryId,
          isFeatured: isFeatured || false,
        },
        include: {
          category: true,
        },
      });

      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }
);

// Update product (admin only)
router.put(
  '/:id',
  authenticate,
  isAdmin,
  validate([
    body('name').optional().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
    body('stock').optional().isInt({ min: 0 }),
  ]),
  async (req, res, next) => {
    try {
      const product = await prisma.product.update({
        where: { id: req.params.id },
        data: req.body,
        include: {
          category: true,
        },
      });

      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

// Delete product (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res, next) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
