import { test, expect } from '../fixtures/auth.fixture';
import { FormHelpers } from '../helpers/form-helpers';

test.describe('CATI Form - Submission & Status Tests', () => {
  let formHelpers: FormHelpers;

  test.beforeEach(async ({ authenticatedPage }) => {
    formHelpers = new FormHelpers(authenticatedPage);
    await formHelpers.navigateToForm(421);
  });

  test('should set status=2 and final_submit=1 on successful submit', async ({ authenticatedPage }) => {
    // Mock API and intercept request
    let capturedRequest: any = null;
    
    await authenticatedPage.route('**/api/cati/interviews/**', async (route) => {
      const request = route.request();
      capturedRequest = JSON.parse(request.postData() || '{}');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: 421, status: 2 },
          message: 'Interview updated successfully',
        }),
      });
    });
    
    // Fill all required fields
    await formHelpers.selectRadio('number_status', '1');
    await formHelpers.selectRadio('q_call_status', '1');
    await formHelpers.selectRadio('consent', '1');
    await formHelpers.fillNumber('resp_age', 35);
    await formHelpers.selectRadio('resp_registered_voter', '1');
    await formHelpers.selectRadio('resp_gender', '1');
    
    // Submit
    await formHelpers.clickSubmit();
    
    // Wait for API call
    await authenticatedPage.waitForTimeout(1000);
    
    // Verify request payload
    expect(capturedRequest).not.toBeNull();
    expect(capturedRequest.status).toBe(2);
    expect(capturedRequest.final_submit).toBe(1);
  });

  test('should set status=3 and final_submit=0 on call dropped', async ({ authenticatedPage }) => {
    // Mock API and intercept request
    let capturedRequest: any = null;
    
    await authenticatedPage.route('**/api/cati/interviews/**', async (route) => {
      const request = route.request();
      capturedRequest = JSON.parse(request.postData() || '{}');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: 421, status: 3 },
          message: 'Interview updated successfully',
        }),
      });
    });
    
    // Fill some fields
    await formHelpers.selectRadio('number_status', '1');
    await formHelpers.selectRadio('q_call_status', '1');
    
    // Click Call Dropped
    await formHelpers.clickCallDropped();
    
    // Wait for API call
    await authenticatedPage.waitForTimeout(1000);
    
    // Verify request payload
    expect(capturedRequest).not.toBeNull();
    expect(capturedRequest.status).toBe(3);
    expect(capturedRequest.final_submit).toBe(0);
  });

  test('should set status=4 on auto-save', async ({ authenticatedPage }) => {
    // Mock API and intercept request
    let capturedRequest: any = null;
    
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
    
    // Fill a field to trigger auto-save
    await formHelpers.selectRadio('number_status', '1');
    
    // Wait for auto-save (debounced 1 second)
    await formHelpers.waitForAutoSave(1500);
    
    // Verify request payload
    expect(capturedRequest).not.toBeNull();
    expect(capturedRequest.status).toBe(4);
  });

  test('should include form_duration_seconds in submission', async ({ authenticatedPage }) => {
    // Mock API and intercept request
    let capturedRequest: any = null;
    
    await authenticatedPage.route('**/api/cati/interviews/**', async (route) => {
      const request = route.request();
      capturedRequest = JSON.parse(request.postData() || '{}');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: 421, status: 2 },
          message: 'Interview updated successfully',
        }),
      });
    });
    
    // Wait for timer to increment
    await authenticatedPage.waitForTimeout(3000);
    
    // Fill all required fields
    await formHelpers.selectRadio('number_status', '1');
    await formHelpers.selectRadio('q_call_status', '1');
    await formHelpers.selectRadio('consent', '1');
    await formHelpers.fillNumber('resp_age', 35);
    await formHelpers.selectRadio('resp_registered_voter', '1');
    await formHelpers.selectRadio('resp_gender', '1');
    
    // Submit
    await formHelpers.clickSubmit();
    
    // Wait for API call
    await authenticatedPage.waitForTimeout(1000);
    
    // Verify request payload
    expect(capturedRequest).not.toBeNull();
    expect(capturedRequest.form_duration_seconds).toBeGreaterThan(0);
  });

  test('should include language_used in submission', async ({ authenticatedPage }) => {
    // Mock API and intercept request
    let capturedRequest: any = null;
    
    await authenticatedPage.route('**/api/cati/interviews/**', async (route) => {
      const request = route.request();
      capturedRequest = JSON.parse(request.postData() || '{}');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: 421, status: 2 },
          message: 'Interview updated successfully',
        }),
      });
    });
    
    // Change language to Hindi
    await formHelpers.changeLanguage('hindi');
    
    // Fill all required fields
    await formHelpers.selectRadio('number_status', '1');
    await formHelpers.selectRadio('q_call_status', '1');
    await formHelpers.selectRadio('consent', '1');
    await formHelpers.fillNumber('resp_age', 35);
    await formHelpers.selectRadio('resp_registered_voter', '1');
    await formHelpers.selectRadio('resp_gender', '1');
    
    // Submit
    await formHelpers.clickSubmit();
    
    // Wait for API call
    await authenticatedPage.waitForTimeout(1000);
    
    // Verify request payload
    expect(capturedRequest).not.toBeNull();
    expect(capturedRequest.language_used).toBe('hindi');
  });

  test('should include timezone and local datetime in submission', async ({ authenticatedPage }) => {
    // Mock API and intercept request
    let capturedRequest: any = null;
    
    await authenticatedPage.route('**/api/cati/interviews/**', async (route) => {
      const request = route.request();
      capturedRequest = JSON.parse(request.postData() || '{}');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: 421, status: 2 },
          message: 'Interview updated successfully',
        }),
      });
    });
    
    // Fill all required fields
    await formHelpers.selectRadio('number_status', '1');
    await formHelpers.selectRadio('q_call_status', '1');
    await formHelpers.selectRadio('consent', '1');
    await formHelpers.fillNumber('resp_age', 35);
    await formHelpers.selectRadio('resp_registered_voter', '1');
    await formHelpers.selectRadio('resp_gender', '1');
    
    // Submit
    await formHelpers.clickSubmit();
    
    // Wait for API call
    await authenticatedPage.waitForTimeout(1000);
    
    // Verify request payload
    expect(capturedRequest).not.toBeNull();
    expect(capturedRequest.user_timezone).toBeDefined();
    expect(capturedRequest.user_localdatetime).toBeDefined();
  });

  test('should redirect to new-call page after successful submit', async ({ authenticatedPage }) => {
    // Mock API response
    await formHelpers.mockAPIResponse('**/api/cati/interviews/**', {
      success: true,
      data: { id: 421, status: 2 },
      message: 'Interview updated successfully',
    });
    
    // Fill all required fields
    await formHelpers.selectRadio('number_status', '1');
    await formHelpers.selectRadio('q_call_status', '1');
    await formHelpers.selectRadio('consent', '1');
    await formHelpers.fillNumber('resp_age', 35);
    await formHelpers.selectRadio('resp_registered_voter', '1');
    await formHelpers.selectRadio('resp_gender', '1');
    
    // Submit
    await formHelpers.clickSubmit();
    
    // Wait for success toast
    await formHelpers.waitForToast('Form submitted successfully');
    
    // Should redirect to new-call page
    await formHelpers.waitForNavigationAfterSubmit('/cati/ss/new-call/');
  });

  test('should redirect to new-call page after call dropped', async ({ authenticatedPage }) => {
    // Mock API response
    await formHelpers.mockAPIResponse('**/api/cati/interviews/**', {
      success: true,
      data: { id: 421, status: 3 },
      message: 'Interview updated successfully',
    });
    
    // Fill some fields
    await formHelpers.selectRadio('number_status', '1');
    
    // Click Call Dropped
    await formHelpers.clickCallDropped();
    
    // Wait for success toast
    await formHelpers.waitForToast('Call dropped');
    
    // Should redirect to new-call page
    await formHelpers.waitForNavigationAfterSubmit('/cati/ss/new-call/');
  });

  test('should show error toast on API failure', async ({ authenticatedPage }) => {
    // Mock API error response
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
    
    // Fill all required fields
    await formHelpers.selectRadio('number_status', '1');
    await formHelpers.selectRadio('q_call_status', '1');
    await formHelpers.selectRadio('consent', '1');
    await formHelpers.fillNumber('resp_age', 35);
    await formHelpers.selectRadio('resp_registered_voter', '1');
    await formHelpers.selectRadio('resp_gender', '1');
    
    // Submit
    await formHelpers.clickSubmit();
    
    // Should show error toast
    await formHelpers.waitForToast('Failed to save form');
    
    // Should not redirect
    await expect(authenticatedPage).toHaveURL(/.*tele-form-v2.*/);
  });
});

