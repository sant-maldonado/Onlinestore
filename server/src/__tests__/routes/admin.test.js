import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../app.js';

function getToken(role) {
  return jwt.sign({ id: 'u1', email: 'u@test.com', role }, process.env.JWT_SECRET);
}

describe('Admin routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/admin/stats', () => {
    it('should return 403 for non-admin users', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${getToken('USER')}`);

      expect(res.status).toBe(403);
    });

    it('should return stats for admin', async () => {
      globalThis.__mockPrisma.product.count.mockResolvedValue(10);
      globalThis.__mockPrisma.order.count.mockResolvedValue(25);
      globalThis.__mockPrisma.user.count.mockResolvedValue(5);
      globalThis.__mockPrisma.order.aggregate
        .mockResolvedValueOnce({ _sum: { total: 500000 } })
        .mockResolvedValueOnce({ _sum: { total: 150000 } });

      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${getToken('ADMIN')}`);

      expect(res.status).toBe(200);
      expect(res.body.totalProducts).toBe(10);
      expect(res.body.totalOrders).toBe(25);
      expect(res.body.totalUsers).toBe(5);
      expect(res.body.totalRevenue).toBe(500000);
      expect(res.body.monthlyRevenue).toBe(150000);
    });
  });

  describe('CRUD /api/admin/products', () => {
    it('should list products', async () => {
      globalThis.__mockPrisma.product.findMany.mockResolvedValue([{ id: 'p1', name: 'Test', category: {} }]);

      const res = await request(app)
        .get('/api/admin/products')
        .set('Authorization', `Bearer ${getToken('ADMIN')}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('should create a product', async () => {
      const newProduct = { id: 'new-p1', name: 'New Product', price: 5000, stock: 10, categoryId: 'c1' };
      globalThis.__mockPrisma.product.create.mockResolvedValue({ ...newProduct, category: { id: 'c1', name: 'Test' } });

      const res = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${getToken('ADMIN')}`)
        .send({ name: 'New Product', price: 5000, categoryId: 'c1', stock: 10 });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('New Product');
    });

    it('should return 400 when creating without required fields', async () => {
      const res = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${getToken('ADMIN')}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Name, price and category are required');
    });

    it('should update a product', async () => {
      const updated = { id: 'p1', name: 'Updated', price: 9999, stock: 20, category: {} };
      globalThis.__mockPrisma.product.update.mockResolvedValue(updated);

      const res = await request(app)
        .put('/api/admin/products/p1')
        .set('Authorization', `Bearer ${getToken('ADMIN')}`)
        .send({ name: 'Updated', price: 9999 });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated');
    });

    it('should delete a product', async () => {
      globalThis.__mockPrisma.product.delete.mockResolvedValue({ id: 'p1' });

      const res = await request(app)
        .delete('/api/admin/products/p1')
        .set('Authorization', `Bearer ${getToken('ADMIN')}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Product deleted');
    });
  });

  describe('GET /api/admin/orders', () => {
    it('should list all orders', async () => {
      globalThis.__mockPrisma.order.findMany.mockResolvedValue([
        { id: 'o1', total: 10000, status: 'PAID', user: {}, items: [] },
      ]);

      const res = await request(app)
        .get('/api/admin/orders')
        .set('Authorization', `Bearer ${getToken('ADMIN')}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('should filter orders by status', async () => {
      globalThis.__mockPrisma.order.findMany.mockResolvedValue([]);

      await request(app)
        .get('/api/admin/orders?status=PAID')
        .set('Authorization', `Bearer ${getToken('ADMIN')}`);

      expect(globalThis.__mockPrisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'PAID' },
        })
      );
    });
  });

  describe('PUT /api/admin/orders/:id/status', () => {
    it('should update order status', async () => {
      const updated = { id: 'o1', status: 'SHIPPED', user: {}, items: [] };
      globalThis.__mockPrisma.order.update.mockResolvedValue(updated);

      const res = await request(app)
        .put('/api/admin/orders/o1/status')
        .set('Authorization', `Bearer ${getToken('ADMIN')}`)
        .send({ status: 'SHIPPED' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('SHIPPED');
    });

    it('should return 400 for invalid status', async () => {
      const res = await request(app)
        .put('/api/admin/orders/o1/status')
        .set('Authorization', `Bearer ${getToken('ADMIN')}`)
        .send({ status: 'INVALID' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid status');
    });
  });
});
