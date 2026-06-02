import { describe, it, expect, vi } from 'vitest';
import { adminOnly } from '../../middleware/adminMiddleware.js';

describe('adminMiddleware', () => {
  it('should return 403 if req.user is missing', () => {
    const req = {};
    const res = { status: vi.fn(() => res), json: vi.fn(() => res) };
    const next = vi.fn();

    adminOnly(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Access denied. Admin only.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if user role is not ADMIN', () => {
    const req = { user: { id: '1', role: 'USER' } };
    const res = { status: vi.fn(() => res), json: vi.fn(() => res) };
    const next = vi.fn();

    adminOnly(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('should call next() if user role is ADMIN', () => {
    const req = { user: { id: '2', role: 'ADMIN' } };
    const res = { status: vi.fn(() => res), json: vi.fn(() => res) };
    const next = vi.fn();

    adminOnly(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
