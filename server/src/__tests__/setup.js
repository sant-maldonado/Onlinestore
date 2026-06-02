import { vi } from 'vitest';

process.env.JWT_SECRET = 'test-secret-key';
process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
process.env.CLIENT_URL = 'http://localhost:5173';

const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    upsert: vi.fn(),
    count: vi.fn(),
  },
  product: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  category: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
  order: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
    aggregate: vi.fn(),
  },
  orderItem: {
    create: vi.fn(),
  },
  $disconnect: vi.fn(),
};

globalThis.__mockPrisma = mockPrisma;

vi.mock('@prisma/client', () => {
  const mock = globalThis.__mockPrisma;
  return { PrismaClient: vi.fn(() => mock) };
});

vi.mock('../prisma/prisma.js', () => {
  const mock = globalThis.__mockPrisma;
  return { default: mock };
});
