import { Router } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '../prisma/prisma.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'online-store',
    format: 'webp',
  },
});

const upload = multer({ storage });

const router = Router();

router.use(authenticate, adminOnly);

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: req.file.path });
});

router.get('/stats', async (req, res, next) => {
  try {
    const [products, orders, users] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
    ]);

    const revenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: 'CANCELLED' } },
    });

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthlyRevenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: {
        createdAt: { gte: monthStart },
        status: { not: 'CANCELLED' },
      },
    });

    res.json({
      totalProducts: products,
      totalOrders: orders,
      totalUsers: users,
      totalRevenue: revenue._sum.total || 0,
      monthlyRevenue: monthlyRevenue._sum.total || 0,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/products', async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.post('/products', async (req, res, next) => {
  try {
    const { name, description, price, image, stock, categoryId } = req.body;
    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'Name, price and category are required' });
    }

    const product = await prisma.product.create({
      data: { name, description, price: Math.round(price), image, stock: stock || 0, categoryId },
      include: { category: true },
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

router.put('/products/:id', async (req, res, next) => {
  try {
    const { name, description, price, image, stock, categoryId } = req.body;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price: Math.round(price) }),
        ...(image !== undefined && { image }),
        ...(stock !== undefined && { stock }),
        ...(categoryId && { categoryId }),
      },
      include: { category: true },
    });

    res.json(product);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    next(err);
  }
});

router.delete('/products/:id', async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    next(err);
  }
});

router.get('/orders', async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, name: true } },
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.get('/orders/:id', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, email: true, name: true } },
        items: { include: { product: true } },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
});

router.put('/orders/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        user: { select: { id: true, email: true, name: true } },
        items: { include: { product: true } },
      },
    });

    res.json(order);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Order not found' });
    }
    next(err);
  }
});

router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

export default router;
