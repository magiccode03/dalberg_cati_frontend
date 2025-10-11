# 🚀 Playwright Testing - Quick Start Guide

## 📦 **Installation** (One-Time Setup)

```bash
cd project-frontend

# Install dependencies (including Playwright)
npm install

# Install Playwright browsers
npx playwright install
```

---

## 🎯 **Running Tests**

### **1. Interactive UI Mode** (Recommended for Development)
```bash
npm run test:e2e:ui
```
**Benefits:**
- ✅ Visual test explorer
- ✅ Watch mode (auto-rerun on file changes)
- ✅ Step-through debugging
- ✅ See browser in action

### **2. Headless Mode** (Fast, CI/CD)
```bash
npm run test:e2e
```

### **3. Generate & View HTML Report**
```bash
npm run test:report
```
Automatically opens beautiful HTML report in browser!

---

## 📊 **View Test Report**

After running tests, view the report:

```bash
npx playwright show-report
```

**Report Includes:**
- ✅ Test results summary
- ✅ Detailed logs
- ✅ Screenshots (on failures)
- ✅ Videos (on failures)
- ✅ Error messages
- ✅ Duration metrics

---

## 🎨 **Common Commands**

```bash
# Run all tests
npm run test:e2e

# Run in UI mode (best for development)
npm run test:e2e:ui

# Run with visible browser
npm run test:e2e:headed

# Debug mode (step-by-step)
npm run test:e2e:debug

# Run specific test file
npm run test:validation
npm run test:conditional
npm run test:submission
npm run test:autosave

# Run on specific browser
npm run test:chromium
npm run test:firefox
npm run test:mobile

# Generate & show report
npm run test:report
```

---

## 📁 **Test Files Location**

```
tests/
├── cati-form/
│   ├── 01-form-validation.spec.ts    (10 tests)
│   ├── 02-conditional-logic.spec.ts   (9 tests)
│   ├── 03-submission-status.spec.ts   (10 tests)
│   └── 04-auto-save.spec.ts           (9 tests)
```

**Total: 38+ tests** covering all form scenarios!

---

## ✅ **Test Coverage**

- ✅ Form validation (required fields, error messages)
- ✅ Conditional logic (field visibility based on selections)
- ✅ Submission (status values, API payloads)
- ✅ Auto-save (debouncing, draft status)
- ✅ Language switching
- ✅ UI/UX (toasts, scrolling, responsiveness)
- ✅ Error handling
- ✅ Mobile compatibility

---

## 🔧 **Prerequisites**

Before running tests, ensure:
1. ✅ Dev server is running: `npm run dev`
2. ✅ Backend API is accessible (http://localhost:4001)
3. ✅ Test user credentials are configured in `tests/fixtures/auth.fixture.ts`

---

## 📖 **Full Documentation**

For complete documentation, see:
- **`tests/README.md`** - Detailed test suite documentation
- **`docs/PLAYWRIGHT_TESTING_SETUP.md`** - Complete setup guide

---

## 🎉 **Quick Example**

### **Run Tests in UI Mode:**
```bash
# 1. Start dev server (in terminal 1)
npm run dev

# 2. Run tests in UI mode (in terminal 2)
npm run test:e2e:ui
```

### **View Report:**
```bash
# Run tests and auto-open report
npm run test:report
```

---

## 🐛 **Troubleshooting**

### **Tests failing?**
1. Check dev server is running: `http://localhost:3000`
2. Check backend API is running: `http://localhost:4001`
3. Verify test credentials in `tests/fixtures/auth.fixture.ts`

### **Need to debug?**
```bash
npm run test:e2e:debug
```

### **Want to see browser?**
```bash
npm run test:e2e:headed
```

---

## 🚀 **That's It!**

You're ready to run comprehensive E2E tests for the CATI form!

**Start here:** `npm run test:e2e:ui`

**View report:** `npm run test:report`

Happy Testing! 🎉

