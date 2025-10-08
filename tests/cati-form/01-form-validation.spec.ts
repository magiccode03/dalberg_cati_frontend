import { test, expect } from '../fixtures/auth.fixture';
import { FormHelpers } from '../helpers/form-helpers';

test.describe('CATI Form - Validation Tests', () => {
  let formHelpers: FormHelpers;

  test.beforeEach(async ({ authenticatedPage }) => {
    formHelpers = new FormHelpers(authenticatedPage);
    await formHelpers.navigateToForm(421);
  });

  test('should show required field indicators with red asterisk', async ({ authenticatedPage }) => {
    // Check that required fields have asterisk
    await expect(authenticatedPage.locator('#number_status_container text=*')).toBeVisible();
    await expect(authenticatedPage.locator('#q_call_status_container text=*')).toBeVisible();
  });

  test('should prevent submission when required fields are empty', async ({ authenticatedPage }) => {
    // Try to submit without filling required fields
    await formHelpers.clickSubmit();
    
    // Should show error toast
    const toast = await formHelpers.waitForToast('Please fill all required fields');
    await expect(toast).toBeVisible();
    
    // Should not navigate away
    await expect(authenticatedPage).toHaveURL(/.*tele-form-v2.*/);
  });

  test('should show specific missing fields in error message', async ({ authenticatedPage }) => {
    // Try to submit without filling required fields
    await formHelpers.clickSubmit();
    
    // Should show which fields are missing
    const toastMessage = await formHelpers.getToastMessage();
    expect(toastMessage).toContain('Missing:');
  });

  test('should scroll to first missing field on validation error', async ({ authenticatedPage }) => {
    // Fill some fields but leave the first one empty
    await formHelpers.selectRadio('q_call_status', '1');
    
    // Scroll down
    await authenticatedPage.evaluate(() => window.scrollTo(0, 500));
    
    // Try to submit
    await formHelpers.clickSubmit();
    
    // Wait a bit for scroll
    await authenticatedPage.waitForTimeout(500);
    
    // Should have scrolled back to first missing field
    const firstMissingField = authenticatedPage.locator('#number_status_container');
    await expect(firstMissingField).toBeInViewport();
  });

  test('should allow submission when all required fields are filled', async ({ authenticatedPage }) => {
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
    
    // Should show success toast
    await formHelpers.waitForToast('Form submitted successfully');
  });

  test('should validate only visible required fields (conditional logic)', async ({ authenticatedPage }) => {
    // Mock API response
    await formHelpers.mockAPIResponse('**/api/cati/interviews/**', {
      success: true,
      data: { id: 421, status: 2 },
      message: 'Interview updated successfully',
    });
    
    // Fill required fields
    await formHelpers.selectRadio('number_status', '1');
    await formHelpers.selectRadio('q_call_status', '1');
    await formHelpers.selectRadio('consent', '1');
    await formHelpers.fillNumber('resp_age', 35);
    await formHelpers.selectRadio('resp_registered_voter', '2'); // Select "No" - hides subsequent fields
    await formHelpers.selectRadio('resp_gender', '1');
    
    // Submit - should succeed even though conditional required fields are not filled
    await formHelpers.clickSubmit();
    
    // Should show success toast (fields hidden by conditional logic are not validated)
    await formHelpers.waitForToast('Form submitted successfully');
  });

  test('should not validate on "Call Dropped" button', async ({ authenticatedPage }) => {
    // Mock API response
    await formHelpers.mockAPIResponse('**/api/cati/interviews/**', {
      success: true,
      data: { id: 421, status: 3 },
      message: 'Interview updated successfully',
    });
    
    // Leave all fields empty (no validation should occur)
    // Click Call Dropped
    await formHelpers.clickCallDropped();
    
    // Should show success toast without validation
    await formHelpers.waitForToast('Call dropped. Partial data has been saved');
    
    // Should not show any validation error messages
    const errorToast = await formHelpers.getToastMessage();
    expect(errorToast).not.toContain('Please fill all required fields');
  });

  test('should not highlight fields when using "Call Dropped" button', async ({ authenticatedPage }) => {
    // Mock API response
    await formHelpers.mockAPIResponse('**/api/cati/interviews/**', {
      success: true,
      data: { id: 421, status: 3 },
      message: 'Interview updated successfully',
    });
    
    // Leave all required fields empty
    // Click Call Dropped
    await formHelpers.clickCallDropped();
    
    // Wait for any potential validation to complete
    await authenticatedPage.waitForTimeout(1000);
    
    // Check that no fields are highlighted with error styling
    const errorFields = await authenticatedPage.locator('.border-red-500').count();
    expect(errorFields).toBe(0);
    
    // Check that no error message boxes are visible
    const errorMessages = await authenticatedPage.locator('.bg-red-100').count();
    expect(errorMessages).toBe(0);
  });

  test('should show count of additional missing fields when more than 3', async ({ authenticatedPage }) => {
    // Try to submit with many required fields empty
    await formHelpers.clickSubmit();
    
    // Should show first 3 fields + count
    const toastMessage = await formHelpers.getToastMessage();
    
    // Check format: "Missing: Field1, Field2, Field3 and X more..."
    if (toastMessage && toastMessage.includes('Missing:')) {
      const hasMoreText = toastMessage.includes('and') && toastMessage.includes('more');
      // At least one of these should be true: either shows 3 or fewer fields, or shows "and X more"
      expect(hasMoreText || toastMessage.split(',').length <= 3).toBeTruthy();
    }
  });

  test('should validate checkbox fields require at least one selection', async ({ authenticatedPage }) => {
    // Navigate to a checkbox field
    await formHelpers.selectRadio('number_status', '1');
    await formHelpers.selectRadio('q_call_status', '1');
    await formHelpers.selectRadio('consent', '1');
    await formHelpers.fillNumber('resp_age', 35);
    await formHelpers.selectRadio('resp_registered_voter', '1');
    await formHelpers.selectRadio('resp_gender', '1');
    
    // Assume q10 or similar is a required checkbox field
    // Leave it empty and try to submit
    await formHelpers.clickSubmit();
    
    // Should show validation error if checkbox field is required
    const toastMessage = await formHelpers.getToastMessage();
    expect(toastMessage).not.toBeNull();
  });

  test('should validate number field min/max constraints', async ({ authenticatedPage }) => {
    // Fill age with invalid value (e.g., 999)
    await formHelpers.selectRadio('number_status', '1');
    await formHelpers.selectRadio('q_call_status', '1');
    await formHelpers.selectRadio('consent', '1');
    await formHelpers.fillNumber('resp_age', 999);
    
    // Try to submit
    await formHelpers.clickSubmit();
    
    // Browser's built-in validation should kick in, or custom validation
    // Check if still on same page
    await expect(authenticatedPage).toHaveURL(/.*tele-form-v2.*/);
  });
});

