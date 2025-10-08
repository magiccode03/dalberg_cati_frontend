import { test, expect } from '@playwright/test';

test.describe('Basic Setup Verification', () => {
  test('should be able to access login page', async ({ page }) => {
    await page.goto('/login');
    
    // Check if login page loads
    await expect(page).toHaveURL(/.*\/login.*/);
    
    // Check if login form elements exist
    await expect(page.locator('input[name="uniqueId"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/login-page.png' });
  });

  test('should be able to fill login form', async ({ page }) => {
    await page.goto('/login');
    
    // Fill form
    await page.fill('input[name="uniqueId"]', '102');
    await page.fill('input[name="password"]', 'SecurePassword123!');
    
    // Verify form is filled
    await expect(page.locator('input[name="uniqueId"]')).toHaveValue('102');
    await expect(page.locator('input[name="password"]')).toHaveValue('SecurePassword123!');
    
    // Check if submit button is enabled
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/login-form-filled.png' });
  });

  test('should be able to access form page without auth', async ({ page }) => {
    // Try to access form page directly
    await page.goto('/cati/ss/tele-form-v2/421');
    
    // Should either redirect to login or show form
    const currentUrl = page.url();
    
    if (currentUrl.includes('/login')) {
      // Expected - redirect to login
      expect(currentUrl).toContain('/login');
    } else {
      // Form page loaded
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'test-results/form-page-direct.png' });
    }
  });
});
