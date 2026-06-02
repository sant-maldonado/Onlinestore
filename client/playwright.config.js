import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  timeout: 30000,
  use: {
    baseURL: `http://localhost:${process.env.CLIENT_PORT || 4173}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: `node ../../server/src/server.js`,
      port: 5001,
      reuseExistingServer: !process.env.CI,
      env: {
        PORT: '5001',
        DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost:5433/onlinestore',
        JWT_SECRET: 'test-secret-key',
        STRIPE_SECRET_KEY: 'sk_test_mock',
        CLIENT_URL: `http://localhost:${process.env.CLIENT_PORT || 4173}`,
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'test',
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || 'test',
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'test',
      },
    },
    {
      command: `npx vite preview --port ${process.env.CLIENT_PORT || 4173}`,
      port: parseInt(process.env.CLIENT_PORT || '4173'),
      reuseExistingServer: !process.env.CI,
    },
  ],
});
