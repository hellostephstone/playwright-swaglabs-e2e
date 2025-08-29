import { defineConfig, devices } from '@playwright/test';

// Allow overriding the base URL via env; default to Swag Labs demo
const BASE_URL = process.env.BASE_URL ?? 'https://www.saucedemo.com';

export default defineConfig({
  testDir: './tests',
  /** Run tests in files in parallel (good locally) */
  fullyParallel: true,
  /** Fail CI if someone left test.only */
  forbidOnly: !!process.env.CI,
  /** Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /** Keep CI stable by limiting workers; unlimited locally */
  workers: process.env.CI ? 1 : undefined,

  /** Reporter */
  reporter: 'html',

  /** Defaults for all tests */
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    /** IMPORTANT: Swag Labs uses data-test="..."; map that to getByTestId('...') */
    testIdAttribute: 'data-test',
  },

  /** Timeouts */
  timeout: 30_000,
  expect: { timeout: 5_000 },

  /** Major browsers */
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
