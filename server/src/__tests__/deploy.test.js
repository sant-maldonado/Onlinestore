import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';

const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'JWT_SECRET',
  'STRIPE_SECRET_KEY',
  'CLIENT_URL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

const REQUIRED_DEPLOY_VARS = ['DATABASE_URL', 'JWT_SECRET', 'CLIENT_URL', 'CLOUDINARY_CLOUD_NAME'];

describe('Deploy readiness', () => {
  describe('Environment variables', () => {
    REQUIRED_ENV_VARS.forEach((varName) => {
      it(`${varName} should be defined`, () => {
        expect(process.env[varName]).toBeDefined();
        expect(process.env[varName].length).toBeGreaterThan(0);
      });
    });

    it('should not contain placeholder values in production', () => {
      if (process.env.NODE_ENV === 'production') {
        const val = process.env.STRIPE_WEBHOOK_SECRET || '';
        expect(val).not.toBe('whsec_placeholder');
      }
    });
  });

  describe('Health endpoint', () => {
    it('should return 200 with ok: true', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });
    });

    it('should respond in under 500ms', async () => {
      const start = Date.now();
      await request(app).get('/api/health');
      expect(Date.now() - start).toBeLessThan(500);
    });
  });

  describe('CORS headers', () => {
    it('should allow requests from CLIENT_URL origin', async () => {
      const origin = process.env.CLIENT_URL || 'http://localhost:5173';
      const res = await request(app)
        .get('/api/health')
        .set('Origin', origin);
      expect(res.headers['access-control-allow-origin']).toBe(origin);
    });

    it('should deny requests from unknown origins', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('Origin', 'https://evil-site.com');
      const allowed = res.headers['access-control-allow-origin'];
      expect(allowed).not.toBe('https://evil-site.com');
    });
  });

  describe('JSON body parsing', () => {
    it('should parse JSON body on regular routes', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'pass' });
      expect(res.status).toBe(401);
    });

    it('should not parse JSON body on webhook route', async () => {
      const res = await request(app)
        .post('/api/payments/webhook')
        .set('Content-Type', 'application/json')
        .send({ type: 'test' });
      expect(res.status).not.toBe(200);
    });
  });
});
