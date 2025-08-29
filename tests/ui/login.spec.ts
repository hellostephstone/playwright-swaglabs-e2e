// tests/ui/login.spec.ts
import { test, expect } from '@playwright/test';
import { users } from '../fixtures/users';

test.describe('Swag Labs Login', () => {
  // happy path: standard user logs in and sees inventory
  test('valid user can log in and see inventory', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill(users.standard.username);
    await page.getByTestId('password').fill(users.standard.password);
    await page.getByTestId('login-button').click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  // locked out user should not be able to log in
  test('locked out user cannot log in', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill(users.lockedOut.username);
    await page.getByTestId('password').fill(users.lockedOut.password);
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText(/locked out/i);
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  // username blank should show validation and stay on login page
  test('blank username cannot log in', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('');
    await page.getByTestId('password').fill(users.standard.password);
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText('Username is required');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  // password blank should show validation and stay on login page
  test('blank password cannot log in', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill(users.standard.username);
    await page.getByTestId('password').fill('');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText('Password is required');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  // both fields blank should show username-required validation
  test('blank username and password cannot log in', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('');
    await page.getByTestId('password').fill('');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText('Username is required');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  // problem_user tends to show broken images verify at least one
  test('problem_user shows broken/placeholder product image(s)', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill(users.problemUser.username);
    await page.getByTestId('password').fill(users.problemUser.password);
    await page.getByTestId('login-button').click();

    await expect(page).toHaveURL(/inventory\.html/);

    const imgs = page.locator('.inventory_item_img img');
    const count = await imgs.count();
    expect(count).toBeGreaterThan(0);

    const srcs = await imgs.evaluateAll((els) => els.map((e) => (e as HTMLImageElement).src));
    expect(srcs.some((s) => s.includes('sl-404'))).toBeTruthy();
  });

  // performance_glitch_user works but slow
  test('performance_glitch_user eventually reaches inventory', async ({ page }) => {
    test.slow(); // increases timeout for this test
    await page.goto('/');
    await page.getByTestId('username').fill(users.performanceGlitchUser.username);
    await page.getByTestId('password').fill(users.performanceGlitchUser.password);
    await page.getByTestId('login-button').click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();
  });
});
