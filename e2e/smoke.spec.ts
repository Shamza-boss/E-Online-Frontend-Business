import { test, expect } from '@playwright/test';

test.describe('smoke', () => {
  test('sign-in page loads', async ({ page }) => {
    await page.goto('/signin');
    await expect(page).toHaveURL(/\/signin/);
    // Form is client-rendered; wait for a stable landmark rather than a brittle label.
    await expect(page.locator('form').first()).toBeVisible({ timeout: 15_000 });
  });

  test('unauthenticated dashboard redirects to sign-in', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/signin/, { timeout: 15_000 });
  });
});
