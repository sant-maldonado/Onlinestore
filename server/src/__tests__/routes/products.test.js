import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

const mockProducts = [
  { id: 'p1', name: 'Auriculares', price: 8999, stock: 10, image: 'img.jpg', description: 'Desc', category: { id: 'c1', name: 'Electrónica', slug: 'electronica' }, categoryId: 'c1' },
  { id: 'p2', name: 'Zapatillas', price: 12999, stock: 5, image: null, description: null, category: { id: 'c2', name: 'Ropa', slug: 'ropa' }, categoryId: 'c2' },
];

describe('GET /api/products', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all products', async () => {
    globalThis.__mockPrisma.product.findMany.mockResolvedValue(mockProducts);

    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].name).toBe('Auriculares');
  });

  it('should filter by category slug', async () => {
    globalThis.__mockPrisma.product.findMany.mockResolvedValue([mockProducts[1]]);

    const res = await request(app).get('/api/products?category=ropa');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Zapatillas');
    expect(globalThis.__mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { category: { slug: 'ropa' } },
      })
    );
  });

  it('should return empty array when no products match', async () => {
    globalThis.__mockPrisma.product.findMany.mockResolvedValue([]);

    const res = await request(app).get('/api/products?category=inexistente');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /api/products/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a product by id', async () => {
    globalThis.__mockPrisma.product.findUnique.mockResolvedValue(mockProducts[0]);

    const res = await request(app).get('/api/products/p1');

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Auriculares');
    expect(res.body.price).toBe(8999);
  });

  it('should return 404 if product not found', async () => {
    globalThis.__mockPrisma.product.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/products/nonexistent');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Product not found');
  });
});
