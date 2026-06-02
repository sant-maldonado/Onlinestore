import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { authenticate } from '../../middleware/authMiddleware.js';

function mockReq(headers = {}) {
  return { headers };
}

function mockRes() {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
}

describe('authMiddleware', () => {
  it('should return 401 if no Authorization header', () => {
    const req = mockReq({});
    const res = mockRes();
    const next = vi.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Access denied. No token provided.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if Authorization does not start with Bearer', () => {
    const req = mockReq({ authorization: 'Basic token123' });
    const res = mockRes();
    const next = vi.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should return 401 if token is invalid', () => {
    const req = mockReq({ authorization: 'Bearer invalid-token' });
    const res = mockRes();
    const next = vi.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token.' });
  });

  it('should call next() and set req.user for a valid token', () => {
    const token = jwt.sign(
      { id: '1', email: 'test@test.com', role: 'USER' },
      process.env.JWT_SECRET
    );
    const req = mockReq({ authorization: `Bearer ${token}` });
    const res = mockRes();
    const next = vi.fn();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.email).toBe('test@test.com');
    expect(req.user.role).toBe('USER');
  });

  it('should detect admin role from token', () => {
    const token = jwt.sign(
      { id: '2', email: 'admin@test.com', role: 'ADMIN' },
      process.env.JWT_SECRET
    );
    const req = mockReq({ authorization: `Bearer ${token}` });
    const res = mockRes();
    const next = vi.fn();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.role).toBe('ADMIN');
  });
});
