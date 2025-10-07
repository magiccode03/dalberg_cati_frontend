import { test, expect } from '../fixtures/auth.fixture';
import { FormHelpers } from '../helpers/form-helpers';

test.describe('CATI Form - Auto-Save Tests', () => {
  let formHelpers: FormHelpers;

  test.beforeEach(async ({ authenticatedPage }) => {
    formHelpers = new FormHelpers(authenticatedPage);
    await formHelpers.navigateToForm(421);
  });

  test('should auto-save form data after 1 second of field change', async ({ authenticatedPage }) => {
    let autoSaveCalled = false;
    
    // Mock API and intercept request
    await authenticatedPage.route('**/api/cati/interviews/**', async (route) => {
      const request = route.request();
      if (request.method() === 'PUT') {
        autoSaveCalled = true;
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: 421, status: 4 },
          message: 'Interview updated successfully',
        }),
      });
    });
    
    // Fill a field
    await formHelpers.selectRadio('number_status', '1');
    
    // Wait less than 1 second
    await authenticatedPage.waitForTimeout(500);
    expect(autoSaveCalled).toBe(false);
    
    // Wait for auto-save debounce (1 second total)
    await authenticatedPage.waitForTimeout(600);
    
    // Auto-save should have been called
    expect(autoSaveCalled).toBe(true);
  });

  test('should debounce auto-save on rapid field changes', async ({ authenticatedPage }) => {
    let autoSaveCallCount = 0;
    
    // Mock API and count calls
    await authenticatedPage.route('**/api/cati/interviews/**', async (route) => {
      const request = route.request();
      if (request.method() === 'PUT') {
        autoSaveCallCount++;
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: 421, status: 4 },
          message: 'Interview updated successfully',
        }),
      });
    });
    
    // Make rapid field changes
    await formHelpers.selectRadio('number_status', '1');
    await authenticatedPage.waitForTimeout(300);
    await formHelpers.selectRadio('q_call_status', '1');
    await authenticatedPage.waitForTimeout(300);
    await formHelpers.selectRadio('q_call_status', '2');
    
    // Wait for debounce
    await authenticatedPage.waitForTimeout(1500);
    
    // Should have called auto-save only once or twice (debounced)
    expect(autoSaveCallCount).toBeLessThanOrEqual(2);
  });

  test('should include status=4 in auto-save payload', async ({ authenticatedPage }) => {
    let capturedRequest: any = null;
    
    // Mock API and intercept request
    await authenticatedPage.route('**/api/cati/interviews/**', async (route) => {
      const request = route.request();
      if (request.method() === 'PUT') {
        capturedRequest = JSON.parse(request.postData() || '{}');
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: 421, status: 4 },
          message: 'Interview updated successfully',
        }),
      });
    });
    
    // Fill a field
    await formHelpers.selectRadio('number_status', '1');
    
    // Wait for auto-save
    await formHelpers.waitForAutoSave();
    
    // Verify request payload
    expect(capturedRequest).not.toBeNull();
    expect(capturedRequest.status).toBe(4);
  });

  test('should preserve form data across page refresh (auto-saved)', async ({ authenticatedPage }) => {
    // Mock API
    await formHelpers.mockAPIResponse('**/api/cati/interviews/**', {
      success: true,
      data: { id: 421, status: 4, number_status: 1, q_call_status: 1 },
      message: 'Interview updated successfully',
    });
    
    // Fill some fields
    await formHelpers.selectRadio('number_status', '1');
    await formHelpers.selectRadio('q_call_status', '1');
    
    // Wait for auto-save
    await formHelpers.waitForAutoSave();
    
    // Reload page
    await authenticatedPage.reload();
    await authenticatedPage.waitForLoadState('networkidle');
    
    // Check if fields are still selected (should be loaded from API)
    // This requires the form to load existing data
    const numberStatusValue = await formHelpers.getRadioValue('number_status');
    expect(numberStatusValue).toBe('1');
  });

  test('should not trigger auto-save if no fields changed', async ({ authenticatedPage }) => {
    let autoSaveCalled = false;
    
    // Mock API
    await authenticatedPage.route('**/api/cati/interviews/**', async (route) => {
      const request = route.request();
      if (request.method() === 'PUT') {
        autoSaveCalled = true;
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: 421, status: 4 },
          message: 'Interview updated successfully',
        }),
      });
    });
    
    // Don't change any fields
    // Wait for potential auto-save time
    await authenticatedPage.waitForTimeout(2000);
    
    // Auto-save should NOT have been called
    expect(autoSaveCalled).toBe(false);
  });

  test('should handle auto-save API errors gracefully', async ({ authenticatedPage }) => {
    // Mock API error
    await authenticatedPage.route('**/api/cati/interviews/**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Server error',
        }),
      });
    });
    
    // Fill a field
    await formHelpers.selectRadio('number_status', '1');
    
    // Wait for auto-save
    await authenticatedPage.waitForTimeout(1500);
    
    // Form should still be functional (no crash)
    // Can still interact with form
    await formHelpers.selectRadio('q_call_status', '1');
    await expect(authenticatedPage.locator('#q_call_status_1')).toBeChecked();
  });

  test('should continue auto-saving after initial save', async ({ authenticatedPage }) => {
    let autoSaveCallCount = 0;
    
    // Mock API
    await authenticatedPage.route('**/api/cati/interviews/**', async (route) => {
      const request = route.request();
      if (request.method() === 'PUT') {
        autoSaveCallCount++;
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: 421, status: 4 },
          message: 'Interview updated successfully',
        }),
      });
    });
    
    // Fill first field
    await formHelpers.selectRadio('number_status', '1');
    await formHelpers.waitForAutoSave();
    
    const firstCallCount = autoSaveCallCount;
    expect(firstCallCount).toBeGreaterThan(0);
    
    // Fill second field
    await formHelpers.selectRadio('q_call_status', '1');
    await formHelpers.waitForAutoSave();
    
    // Should have made another auto-save call
    expect(autoSaveCallCount).toBeGreaterThan(firstCallCount);
  });

  test('should include form duration in auto-save', async ({ authenticatedPage }) => {
    let capturedRequest: any = null;
    
    // Mock API
    await authenticatedPage.route('**/api/cati/interviews/**', async (route) => {
      const request = route.request();
      if (request.method() === 'PUT') {
        capturedRequest = JSON.parse(request.postData() || '{}');
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: 421, status: 4 },
          message: 'Interview updated successfully',
        }),
      });
    });
    
    // Wait for timer to increment
    await authenticatedPage.waitForTimeout(2000);
    
    // Fill a field
    await formHelpers.selectRadio('number_status', '1');
    
    // Wait for auto-save
    await formHelpers.waitForAutoSave();
    
    // Verify form_duration_seconds is included
    expect(capturedRequest).not.toBeNull();
    expect(capturedRequest.form_duration_seconds).toBeGreaterThan(0);
  });
});

