import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load and show brand', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=OnlineStore')).toBeVisible();
  });

  test('should show login button when not authenticated', async ({ page }) => {
    await page.goto('/');
    const loginBtn = page.locator('text=Ingresar');
    await expect(loginBtn).toBeVisible();
  });

  test('should display product cards', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('[class*="product"]');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
  });
});
