import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../app.js';

function getAuthToken(role = 'USER') {
  return jwt.sign({ id: 'user-1', email: 'test@test.com', role }, process.env.JWT_SECRET);
}

describe('GET /api/orders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 without auth token', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(401);
  });

  it('should return user orders with valid token', async () => {
    const mockOrders = [
      {
        id: 'order-1',
        total: 8999,
        status: 'PENDING',
        userId: 'user-1',
        createdAt: new Date().toISOString(),
        items: [{ id: 'oi1', productId: 'p1', quantity: 1, price: 8999, product: { name: 'Auriculares' } }],
      },
    ];

    globalThis.__mockPrisma.order.findMany.mockResolvedValue(mockOrders);

    const token = getAuthToken();
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].total).toBe(8999);
    expect(globalThis.__mockPrisma.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'user-1' },
      })
    );
  });

  it('should return empty array if user has no orders', async () => {
    globalThis.__mockPrisma.order.findMany.mockResolvedValue([]);

    const token = getAuthToken();
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
