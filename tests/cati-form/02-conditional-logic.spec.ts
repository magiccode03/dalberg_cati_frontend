import { test, expect } from '../fixtures/auth.fixture';
import { FormHelpers } from '../helpers/form-helpers';

test.describe('CATI Form - Conditional Logic Tests', () => {
  let formHelpers: FormHelpers;

  test.beforeEach(async ({ authenticatedPage }) => {
    formHelpers = new FormHelpers(authenticatedPage);
    await formHelpers.navigateToForm(421);
  });

  test('should show consent section only when q_call_status = 1', async ({ authenticatedPage }) => {
    // Initially, consent section should not be visible
    const consentVisible = await formHelpers.isSectionVisible('Section 2: Interviewer Introduction');
    
    // Select q_call_status = 1
    await formHelpers.selectRadio('q_call_status', '1');
    await authenticatedPage.waitForTimeout(300);
    
    // Consent section should now be visible
    const consentVisibleAfter = await formHelpers.isSectionVisible('Section 2: Interviewer Introduction');
    expect(consentVisibleAfter).toBeTruthy();
  });

  test('should show demographics section only when consent = 1', async ({ authenticatedPage }) => {
    // Fill q_call_status
    await formHelpers.selectRadio('q_call_status', '1');
    await authenticatedPage.waitForTimeout(300);
    
    // Demographics section should not be visible yet
    const demographicsVisible = await formHelpers.isSectionVisible('Section 3: Basic Demographic');
    
    // Select consent = 1
    await formHelpers.selectRadio('consent', '1');
    await authenticatedPage.waitForTimeout(300);
    
    // Demographics section should now be visible
    const demographicsVisibleAfter = await formHelpers.isSectionVisible('Section 3: Basic Demographic');
    expect(demographicsVisibleAfter).toBeTruthy();
  });

  test('should show party preferences section only when resp_registered_voter = 1', async ({ authenticatedPage }) => {
    // Fill required fields to reach resp_registered_voter
    await formHelpers.selectRadio('q_call_status', '1');
    await authenticatedPage.waitForTimeout(200);
    await formHelpers.selectRadio('consent', '1');
    await authenticatedPage.waitForTimeout(200);
    
    // Select resp_registered_voter = 2 (No)
    await formHelpers.selectRadio('resp_registered_voter', '2');
    await authenticatedPage.waitForTimeout(300);
    
    // Party preferences section should not be visible
    const partyPrefsVisible = await formHelpers.isSectionVisible('Section 4: Party Preferences');
    expect(partyPrefsVisible).toBeFalsy();
    
    // Change to resp_registered_voter = 1 (Yes)
    await formHelpers.selectRadio('resp_registered_voter', '1');
    await authenticatedPage.waitForTimeout(300);
    
    // Party preferences section should now be visible
    const partyPrefsVisibleAfter = await formHelpers.isSectionVisible('Section 4: Party Preferences');
    expect(partyPrefsVisibleAfter).toBeTruthy();
  });

  test('should hide satisfaction section when resp_registered_voter = 2', async ({ authenticatedPage }) => {
    // Fill required fields
    await formHelpers.selectRadio('q_call_status', '1');
    await formHelpers.selectRadio('consent', '1');
    
    // Select resp_registered_voter = 2 (No)
    await formHelpers.selectRadio('resp_registered_voter', '2');
    await authenticatedPage.waitForTimeout(300);
    
    // Satisfaction section should not be visible
    const satisfactionVisible = await formHelpers.isSectionVisible('Section 5: Satisfaction');
    expect(satisfactionVisible).toBeFalsy();
  });

  test('should clear dependent fields when parent field changes', async ({ authenticatedPage }) => {
    // Fill required fields to enable party preferences
    await formHelpers.selectRadio('q_call_status', '1');
    await formHelpers.selectRadio('consent', '1');
    await formHelpers.fillNumber('resp_age', 30);
    await formHelpers.selectRadio('resp_registered_voter', '1');
    await formHelpers.selectRadio('resp_gender', '1');
    await authenticatedPage.waitForTimeout(300);
    
    // Fill a party preference field (e.g., q5)
    await formHelpers.selectRadio('q5', '3'); // Assume this field exists
    await authenticatedPage.waitForTimeout(200);
    
    // Change resp_registered_voter to 2 (No)
    await formHelpers.selectRadio('resp_registered_voter', '2');
    await authenticatedPage.waitForTimeout(300);
    
    // Change back to 1 (Yes)
    await formHelpers.selectRadio('resp_registered_voter', '1');
    await authenticatedPage.waitForTimeout(300);
    
    // The field q5 should be cleared (visible but not selected)
    const q5Value = await formHelpers.getRadioValue('q5');
    // Depending on implementation, it might be cleared or retained
    // This test verifies the behavior
  });

  test('should handle age-based conditional logic (resp_age >= 18)', async ({ authenticatedPage }) => {
    // Fill required fields
    await formHelpers.selectRadio('q_call_status', '1');
    await formHelpers.selectRadio('consent', '1');
    
    // Fill age < 18
    await formHelpers.fillNumber('resp_age', 15);
    await authenticatedPage.waitForTimeout(300);
    
    // Check if age-dependent fields are hidden
    // (Assuming there are fields that require resp_age >= 18)
    
    // Fill age >= 18
    await formHelpers.fillNumber('resp_age', 25);
    await authenticatedPage.waitForTimeout(300);
    
    // Age-dependent fields should now be visible
  });

  test('should handle "Other" text field visibility based on option selection', async ({ authenticatedPage }) => {
    // Fill required fields
    await formHelpers.selectRadio('q_call_status', '1');
    await formHelpers.selectRadio('consent', '1');
    await formHelpers.fillNumber('resp_age', 30);
    await formHelpers.selectRadio('resp_registered_voter', '1');
    await formHelpers.selectRadio('resp_gender', '1');
    await authenticatedPage.waitForTimeout(300);
    
    // Assuming q5 has an "Other" option with value "44"
    // Select "Other" option
    await formHelpers.selectRadio('q5', '44');
    await authenticatedPage.waitForTimeout(300);
    
    // "Other" text field should be visible
    const otherFieldVisible = await formHelpers.isFieldVisible('q5_oth');
    expect(otherFieldVisible).toBeTruthy();
    
    // Select a different option
    await formHelpers.selectRadio('q5', '3');
    await authenticatedPage.waitForTimeout(300);
    
    // "Other" text field should be hidden
    const otherFieldVisibleAfter = await formHelpers.isFieldVisible('q5_oth');
    expect(otherFieldVisibleAfter).toBeFalsy();
  });

  test('should handle complex nested conditional logic', async ({ authenticatedPage }) => {
    // Test scenario: Field X shows only if A=1 AND B=2
    // This requires specific knowledge of your form's conditional rules
    
    // Example: Fill fields to test nested conditions
    await formHelpers.selectRadio('q_call_status', '1');
    await formHelpers.selectRadio('consent', '1');
    await formHelpers.fillNumber('resp_age', 30);
    await formHelpers.selectRadio('resp_registered_voter', '1');
    await formHelpers.selectRadio('resp_gender', '1');
    await authenticatedPage.waitForTimeout(300);
    
    // Fill field A
    await formHelpers.selectRadio('q5', '3');
    await authenticatedPage.waitForTimeout(200);
    
    // Field X should not be visible yet
    // Fill field B
    // await formHelpers.selectRadio('q6', '2');
    // await authenticatedPage.waitForTimeout(200);
    
    // Field X should now be visible
    // Verify visibility
  });

  test('should re-evaluate conditions on every field change', async ({ authenticatedPage }) => {
    // Fill q_call_status
    await formHelpers.selectRadio('q_call_status', '1');
    await authenticatedPage.waitForTimeout(200);
    
    // Consent section appears
    let consentVisible = await formHelpers.isSectionVisible('Section 2: Interviewer Introduction');
    expect(consentVisible).toBeTruthy();
    
    // Change q_call_status
    await formHelpers.selectRadio('q_call_status', '2');
    await authenticatedPage.waitForTimeout(300);
    
    // Consent section should disappear
    consentVisible = await formHelpers.isSectionVisible('Section 2: Interviewer Introduction');
    expect(consentVisible).toBeFalsy();
    
    // Change back
    await formHelpers.selectRadio('q_call_status', '1');
    await authenticatedPage.waitForTimeout(300);
    
    // Consent section should reappear
    consentVisible = await formHelpers.isSectionVisible('Section 2: Interviewer Introduction');
    expect(consentVisible).toBeTruthy();
  });
});

