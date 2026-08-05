import { defineConfig, devices } from '@playwright/test';

/**
 * Smoke E2E against a running Next.js app.
 * Start the app first (`npm run dev` or `npm run start`), then:
 *   npx playwright test
 *
 * Override base URL with PLAYWRIGHT_BASE_URL (default http://localhost:3000).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  /* Do not start a webServer here — auth/API deps make CI flaky without secrets.
     Run against an already-started local or preview deploy. */
});
