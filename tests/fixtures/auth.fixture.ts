import { test as base } from '@playwright/test';

// Define authenticated user context
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Login before each test
    await page.goto('/login');
    
    // Wait for login form to load
    await page.waitForSelector('input[name="uniqueId"]', { timeout: 10000 });
    
    // Fill login form with correct credentials
    await page.fill('input[name="uniqueId"]', '102');
    await page.fill('input[name="password"]', 'SecurePassword123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for login to complete - check for success message or navigation
    try {
      // Wait for either success message or navigation
      await Promise.race([
        page.waitForSelector('text=Login successful', { timeout: 10000 }),
        page.waitForURL(/.*\/(home|dashboard|cati\/ss\/start-form-filling).*/, { timeout: 10000 }),
        page.waitForSelector('[data-testid="user-menu"], .user-menu', { timeout: 10000 })
      ]);
      
      // If we see success message, wait for redirect
      const successMessage = page.locator('text=Login successful');
      if (await successMessage.isVisible()) {
        await page.waitForURL(/.*\/(home|dashboard|cati\/ss\/start-form-filling).*/, { timeout: 10000 });
      }
    } catch (error) {
      // If navigation doesn't happen, check if we're still on login page with error
      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        // Check for error message (avoid Next.js route announcer)
        const errorAlert = page.locator('.alert').filter({ hasNotText: 'Login successful' });
        const errorMessage = await errorAlert.first().textContent();
        if (errorMessage && errorMessage.trim()) {
          throw new Error(`Login failed with error: ${errorMessage}`);
        }
        throw new Error('Login failed: Still on login page');
      }
    }
    
    // Verify we're logged in by checking for user data or token
    const hasUserData = await page.evaluate(() => {
      return localStorage.getItem('user') || localStorage.getItem('accessToken') || document.querySelector('[data-testid="user-menu"]');
    });
    
    if (!hasUserData) {
      // Take screenshot for debugging
      await page.screenshot({ path: 'test-results/login-failed.png' });
      throw new Error('Authentication failed: No user data or token found');
    }
    
    await use(page);
  },
});

export { expect } from '@playwright/test';

