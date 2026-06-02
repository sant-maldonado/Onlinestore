import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../app.js';

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should register a new user and return 201 with token', async () => {
    globalThis.__mockPrisma.user.findUnique.mockResolvedValue(null);
    globalThis.__mockPrisma.user.create.mockResolvedValue({
      id: 'user-1',
      email: 'new@test.com',
      name: 'New User',
      role: 'USER',
      password: 'hashed',
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'new@test.com', name: 'New User', password: 'Password1' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('new@test.com');
    expect(res.body.user.role).toBe('USER');
  });

  it('should return 400 if email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'No Email', password: 'Password1' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Email, name and password are required');
  });

  it('should return 409 if email is already registered', async () => {
    globalThis.__mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing', email: 'dup@test.com' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@test.com', name: 'Dup', password: 'Password1' });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('Email already registered');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should login and return 200 with token', async () => {
    const hashed = await bcrypt.hash('Password1', 10);
    globalThis.__mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@test.com',
      name: 'Test User',
      role: 'USER',
      password: hashed,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'Password1' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.name).toBe('Test User');
  });

  it('should return 401 if user does not exist', async () => {
    globalThis.__mockPrisma.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nope@test.com', password: 'Password1' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  it('should return 401 if password is wrong', async () => {
    const hashed = await bcrypt.hash('RealPass1', 10);
    globalThis.__mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@test.com',
      password: hashed,
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'WrongPass1' });

    expect(res.status).toBe(401);
  });

  it('should return 400 if email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'Password1' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Email and password are required');
  });
});
