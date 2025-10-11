# CATI Form - Playwright E2E Testing Suite

## 📋 Overview

Comprehensive End-to-End testing suite for the CATI (Computer-Assisted Telephone Interviewing) form using Playwright. This test suite covers all form functionality, validation rules, conditional logic, auto-save, and submission scenarios.

---

## 🎯 Test Coverage

### **1. Form Validation Tests** (`01-form-validation.spec.ts`)
- ✅ Required field indicators (red asterisk)
- ✅ Submission prevention when required fields empty
- ✅ Specific missing fields in error messages
- ✅ Auto-scroll to first missing field
- ✅ Successful submission with all fields filled
- ✅ Conditional required field validation
- ✅ No validation on "Call Dropped" button
- ✅ Multiple missing fields message format
- ✅ Checkbox field validation
- ✅ Number field min/max constraints

### **2. Conditional Logic Tests** (`02-conditional-logic.spec.ts`)
- ✅ Consent section visibility (q_call_status = 1)
- ✅ Demographics section visibility (consent = 1)
- ✅ Party preferences visibility (resp_registered_voter = 1)
- ✅ Satisfaction section hiding (resp_registered_voter = 2)
- ✅ Dependent field clearing on parent change
- ✅ Age-based conditional logic (resp_age >= 18)
- ✅ "Other" text field visibility based on option
- ✅ Complex nested conditional logic
- ✅ Condition re-evaluation on field changes

### **3. Submission & Status Tests** (`03-submission-status.spec.ts`)
- ✅ Status=2, final_submit=1 on successful submit
- ✅ Status=3, final_submit=0 on call dropped
- ✅ Status=4 on auto-save
- ✅ Form duration in submission
- ✅ Language included in submission
- ✅ Timezone and datetime in submission
- ✅ Redirect after successful submit
- ✅ Redirect after call dropped
- ✅ Error toast on API failure

### **4. Auto-Save Tests** (`04-auto-save.spec.ts`)
- ✅ Auto-save after 1 second debounce
- ✅ Debouncing on rapid field changes
- ✅ Status=4 in auto-save payload
- ✅ Form data preservation across refresh
- ✅ No auto-save if no changes
- ✅ Graceful error handling
- ✅ Continued auto-saving after initial save
- ✅ Form duration in auto-save

### **5. Language & Localization Tests** (`05-language.spec.ts`)
- ✅ English language display
- ✅ Bengali language display
- ✅ Hindi language display
- ✅ Language switching updates all fields
- ✅ Selected language persists in submission
- ✅ Option labels update on language change

### **6. UI/UX Tests** (`06-ui-ux.spec.ts`)
- ✅ Form timer display and increment
- ✅ Toast notifications appear and disappear
- ✅ Section headers visibility
- ✅ Responsive design on mobile
- ✅ Teleform user name display
- ✅ Submit button disabled during submission
- ✅ Form sections expand/collapse correctly

### **7. Regression Tests** (`07-regression.spec.ts`)
- ✅ Complete form submission flow
- ✅ Partial submission flow
- ✅ Auto-save during form filling
- ✅ Language switching mid-form
- ✅ Conditional logic chain
- ✅ Error recovery scenarios
- ✅ Network interruption handling
- ✅ Browser back/forward navigation

---

## 🚀 Setup

### **1. Install Dependencies**
```bash
cd project-frontend
npm install --save-dev @playwright/test
npx playwright install
```

### **2. Configure Environment**
Ensure your `.env.local` file has:
```env
NEXT_PUBLIC_API_URL=http://localhost:4001
```

### **3. Start Development Server**
```bash
npm run dev
```

---

## 🧪 Running Tests

### **Run All Tests**
```bash
npm run test:e2e
```

### **Run Specific Test File**
```bash
npx playwright test tests/cati-form/01-form-validation.spec.ts
```

### **Run Tests in UI Mode (Interactive)**
```bash
npx playwright test --ui
```

### **Run Tests in Headed Mode (See Browser)**
```bash
npx playwright test --headed
```

### **Run Tests on Specific Browser**
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### **Run Tests on Mobile**
```bash
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

### **Debug Tests**
```bash
npx playwright test --debug
```

---

## 📊 View Test Reports

### **Generate and View HTML Report**
```bash
npm run test:report
```

This will:
1. Run all tests
2. Generate HTML report in `playwright-report/`
3. Automatically open report in browser

### **View Existing Report**
```bash
npx playwright show-report
```

---

## 📂 Test Structure

```
tests/
├── fixtures/
│   └── auth.fixture.ts          # Authentication setup
├── helpers/
│   └── form-helpers.ts          # Reusable form interaction helpers
├── cati-form/
│   ├── 01-form-validation.spec.ts
│   ├── 02-conditional-logic.spec.ts
│   ├── 03-submission-status.spec.ts
│   ├── 04-auto-save.spec.ts
│   ├── 05-language.spec.ts
│   ├── 06-ui-ux.spec.ts
│   └── 07-regression.spec.ts
└── README.md
```

---

## 🛠️ Test Utilities

### **FormHelpers Class**

Provides convenient methods for interacting with the form:

```typescript
import { FormHelpers } from '../helpers/form-helpers';

const formHelpers = new FormHelpers(page);

// Navigate to form
await formHelpers.navigateToForm(421);

// Select radio button
await formHelpers.selectRadio('q_call_status', '1');

// Select checkbox
await formHelpers.selectCheckbox('q10_1', '1', true);

// Fill text input
await formHelpers.fillText('q5_oth', 'Other party');

// Fill number input
await formHelpers.fillNumber('resp_age', 35);

// Change language
await formHelpers.changeLanguage('hindi');

// Submit form
await formHelpers.clickSubmit();

// Click call dropped
await formHelpers.clickCallDropped();

// Wait for toast
await formHelpers.waitForToast('Form submitted successfully');

// Check field visibility
const isVisible = await formHelpers.isFieldVisible('q5');

// Mock API response
await formHelpers.mockAPIResponse('**/api/cati/interviews/**', {
  success: true,
  data: { id: 421 }
});
```

---

## 🎯 Test Scenarios

### **Scenario 1: Complete Form Submission**
```typescript
test('complete form submission flow', async ({ authenticatedPage }) => {
  const formHelpers = new FormHelpers(authenticatedPage);
  
  // Navigate to form
  await formHelpers.navigateToForm(421);
  
  // Fill all required fields
  await formHelpers.selectRadio('number_status', '1');
  await formHelpers.selectRadio('q_call_status', '1');
  await formHelpers.selectRadio('consent', '1');
  await formHelpers.fillNumber('resp_age', 35);
  await formHelpers.selectRadio('resp_registered_voter', '1');
  await formHelpers.selectRadio('resp_gender', '1');
  // ... fill more fields
  
  // Submit
  await formHelpers.clickSubmit();
  
  // Verify success
  await formHelpers.waitForToast('Form submitted successfully');
  await formHelpers.waitForNavigationAfterSubmit('/cati/ss/new-call/');
});
```

### **Scenario 2: Conditional Logic**
```typescript
test('conditional field visibility', async ({ authenticatedPage }) => {
  const formHelpers = new FormHelpers(authenticatedPage);
  
  await formHelpers.navigateToForm(421);
  
  // Initially section hidden
  let visible = await formHelpers.isSectionVisible('Section 2');
  expect(visible).toBeFalsy();
  
  // Select option that shows section
  await formHelpers.selectRadio('q_call_status', '1');
  await authenticatedPage.waitForTimeout(300);
  
  // Section now visible
  visible = await formHelpers.isSectionVisible('Section 2');
  expect(visible).toBeTruthy();
});
```

### **Scenario 3: Validation Error**
```typescript
test('validation prevents submission', async ({ authenticatedPage }) => {
  const formHelpers = new FormHelpers(authenticatedPage);
  
  await formHelpers.navigateToForm(421);
  
  // Try to submit without filling
  await formHelpers.clickSubmit();
  
  // Verify error
  await formHelpers.waitForToast('Please fill all required fields');
  
  // Still on same page
  await expect(authenticatedPage).toHaveURL(/.*tele-form-v2.*/);
});
```

---

## 📝 Writing New Tests

### **1. Create New Test File**
```typescript
import { test, expect } from '../fixtures/auth.fixture';
import { FormHelpers } from '../helpers/form-helpers';

test.describe('My New Test Suite', () => {
  let formHelpers: FormHelpers;

  test.beforeEach(async ({ authenticatedPage }) => {
    formHelpers = new FormHelpers(authenticatedPage);
    await formHelpers.navigateToForm(421);
  });

  test('my test case', async ({ authenticatedPage }) => {
    // Your test code here
  });
});
```

### **2. Use Fixtures**
- `authenticatedPage`: Pre-authenticated page context
- Automatically logs in before each test
- Access to all Playwright Page methods

### **3. Use Helpers**
- Use `FormHelpers` for common form interactions
- Add new helper methods to `form-helpers.ts` as needed

---

## 🔧 Configuration

### **playwright.config.ts**

```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
});
```

---

## 📈 CI/CD Integration

### **GitHub Actions Example**
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 🐛 Debugging

### **Enable Debug Mode**
```bash
DEBUG=pw:api npx playwright test
```

### **Slow Down Test Execution**
```bash
npx playwright test --slowmo=1000
```

### **Pause Test Execution**
```typescript
await page.pause();
```

### **Take Screenshot**
```typescript
await formHelpers.takeScreenshot('my-screenshot');
```

### **Inspect Element**
```bash
npx playwright test --debug
```

---

## 📊 Test Metrics

### **Expected Test Results:**
- ✅ **Total Tests:** 50+
- ✅ **Pass Rate:** >95%
- ✅ **Average Duration:** 2-5 minutes
- ✅ **Code Coverage:** >80%

### **Performance Benchmarks:**
- Form load time: <2 seconds
- Field interaction: <100ms
- Auto-save trigger: 1 second
- Submission: <3 seconds

---

## 🔍 Troubleshooting

### **Issue: Tests fail on authentication**
- Verify login credentials in `auth.fixture.ts`
- Check if backend is running
- Verify API endpoint URLs

### **Issue: Tests timeout**
- Increase timeout in test config
- Check if dev server is running
- Verify network connectivity

### **Issue: Flaky tests**
- Add proper wait conditions
- Use `waitForLoadState('networkidle')`
- Increase debounce timeouts

### **Issue: Element not found**
- Verify element selectors
- Check if conditional logic hides element
- Use `page.locator().waitFor()`

---

## 📞 Support

For issues or questions:
1. Check test logs and screenshots in `test-results/`
2. View HTML report for detailed failure info
3. Enable debug mode for step-by-step execution
4. Review Playwright documentation: https://playwright.dev

---

## ✅ Best Practices

1. ✅ **Use descriptive test names**
2. ✅ **Keep tests independent**
3. ✅ **Clean up after tests**
4. ✅ **Use page object pattern (FormHelpers)**
5. ✅ **Mock API responses for consistency**
6. ✅ **Add proper wait conditions**
7. ✅ **Take screenshots on failures**
8. ✅ **Run tests in CI/CD pipeline**
9. ✅ **Review test reports regularly**
10. ✅ **Update tests when features change**

---

**Last Updated:** October 7, 2025  
**Playwright Version:** Latest  
**Test Framework:** Playwright Test Runner  
**Status:** ✅ Production Ready

