import { Page, expect } from '@playwright/test';

/**
 * Helper functions for CATI form testing
 */

export class FormHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate to form page
   */
  async navigateToForm(interviewId: string | number) {
    await this.page.goto(`/cati/ss/tele-form-v2/${interviewId}`);
    await this.page.waitForLoadState('networkidle');
    
    // Wait for form to load
    await this.page.waitForSelector('[data-testid="form-container"], .form-container, form', { timeout: 10000 });
  }

  /**
   * Select radio button option
   */
  async selectRadio(fieldTag: string, value: string) {
    // Try multiple selector patterns
    const selectors = [
      `input[id="${fieldTag}_${value}"]`,
      `input[name="${fieldTag}"][value="${value}"]`,
      `input[data-field="${fieldTag}"][value="${value}"]`,
      `#${fieldTag}_${value}`,
      `input[type="radio"][value="${value}"]:near(text="${value}")`
    ];
    
    let selected = false;
    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible()) {
          await element.click();
          selected = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!selected) {
      throw new Error(`Could not find radio button for field ${fieldTag} with value ${value}`);
    }
    
    await this.page.waitForTimeout(100); // Small delay for state update
  }

  /**
   * Select checkbox option
   */
  async selectCheckbox(fieldTag: string, value: string, checked: boolean = true) {
    const checkboxId = `${fieldTag}_${value}`;
    const checkbox = this.page.locator(`input[id="${checkboxId}"]`);
    
    if (checked) {
      await checkbox.check();
    } else {
      await checkbox.uncheck();
    }
    await this.page.waitForTimeout(100);
  }

  /**
   * Fill text input
   */
  async fillText(fieldTag: string, value: string) {
    // Try multiple selector patterns
    const selectors = [
      `input[name="${fieldTag}"]`,
      `input[id="${fieldTag}"]`,
      `input[data-field="${fieldTag}"]`,
      `#${fieldTag}`,
      `textarea[name="${fieldTag}"]`
    ];
    
    let filled = false;
    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible()) {
          await element.fill(value);
          filled = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!filled) {
      throw new Error(`Could not find text input for field ${fieldTag}`);
    }
    
    await this.page.waitForTimeout(100);
  }

  /**
   * Fill number input
   */
  async fillNumber(fieldTag: string, value: number) {
    await this.fillText(fieldTag, value.toString());
  }

  /**
   * Fill datetime input
   */
  async fillDatetime(fieldTag: string, datetime: string) {
    await this.page.fill(`input[name="${fieldTag}"]`, datetime);
    await this.page.waitForTimeout(100);
  }

  /**
   * Change language
   */
  async changeLanguage(language: 'english' | 'bengali' | 'hindi') {
    const languageMap = {
      english: 'English (English)',
      bengali: 'Bangla (বাংলা)',
      hindi: 'Hindi (हिंदी)',
    };
    
    await this.page.click('text=Language:');
    await this.page.click(`text=${languageMap[language]}`);
    await this.page.waitForTimeout(500);
  }

  /**
   * Wait for auto-save
   */
  async waitForAutoSave(timeout: number = 1500) {
    await this.page.waitForTimeout(timeout);
  }

  /**
   * Click submit button
   */
  async clickSubmit() {
    // Try multiple selector patterns for submit button
    const selectors = [
      'button[type="submit"]:has-text("Submit")',
      'button:has-text("Submit")',
      '[data-testid="submit-button"]',
      'button[type="submit"]',
      '.submit-button'
    ];
    
    let clicked = false;
    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible()) {
          await element.click();
          clicked = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!clicked) {
      throw new Error('Could not find submit button');
    }
  }

  /**
   * Click call dropped button
   */
  async clickCallDropped() {
    // Try multiple selector patterns for call dropped button
    const selectors = [
      'button:has-text("Call Dropped")',
      '[data-testid="call-dropped-button"]',
      'button:has-text("Call Drop")',
      '.call-dropped-button'
    ];
    
    let clicked = false;
    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible()) {
          await element.click();
          clicked = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!clicked) {
      throw new Error('Could not find call dropped button');
    }
  }

  /**
   * Check if field is visible
   */
  async isFieldVisible(fieldTag: string): Promise<boolean> {
    const selectors = [
      `#${fieldTag}_container`,
      `[data-field="${fieldTag}"]`,
      `[data-testid="${fieldTag}"]`,
      `input[name="${fieldTag}"]`,
      `input[id="${fieldTag}"]`
    ];
    
    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible()) {
          return true;
        }
      } catch (e) {
        continue;
      }
    }
    
    return false;
  }

  /**
   * Check if field has required indicator
   */
  async isFieldRequired(fieldTag: string): Promise<boolean> {
    const selectors = [
      `#${fieldTag}_container text=*`,
      `#${fieldTag}_container .required`,
      `[data-field="${fieldTag}"] text=*`,
      `input[name="${fieldTag}"] + label text=*`,
      `label:has-text("*"):near(input[name="${fieldTag}"])`
    ];
    
    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible()) {
          return true;
        }
      } catch (e) {
        continue;
      }
    }
    
    return false;
  }

  /**
   * Get toast message
   */
  async getToastMessage(): Promise<string | null> {
    const selectors = [
      '[role="alert"]',
      '.toast',
      '[data-testid="toast"]',
      '.alert',
      '.notification'
    ];
    
    for (const selector of selectors) {
      try {
        const toast = this.page.locator(selector).first();
        if (await toast.isVisible({ timeout: 3000 })) {
          return await toast.textContent();
        }
      } catch (e) {
        continue;
      }
    }
    
    return null;
  }

  /**
   * Wait for toast to appear
   */
  async waitForToast(expectedText?: string, timeout: number = 5000) {
    const selectors = [
      '[role="alert"]',
      '.toast',
      '[data-testid="toast"]',
      '.alert',
      '.notification'
    ];
    
    let toast = null;
    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector).first();
        await element.waitFor({ state: 'visible', timeout });
        toast = element;
        break;
      } catch (e) {
        continue;
      }
    }
    
    if (!toast) {
      throw new Error('Toast did not appear within timeout');
    }
    
    if (expectedText) {
      await expect(toast).toContainText(expectedText);
    }
    
    return toast;
  }

  /**
   * Get form timer value
   */
  async getTimerValue(): Promise<number> {
    const timerText = await this.page.locator('text=/Time:.*s/').textContent();
    if (timerText) {
      const match = timerText.match(/(\d+)s/);
      return match ? parseInt(match[1], 10) : 0;
    }
    return 0;
  }

  /**
   * Check if section is visible
   */
  async isSectionVisible(sectionTitle: string): Promise<boolean> {
    const section = this.page.locator(`text=${sectionTitle}`).locator('..');
    return await section.isVisible();
  }

  /**
   * Scroll to field
   */
  async scrollToField(fieldTag: string) {
    const container = this.page.locator(`#${fieldTag}_container`);
    await container.scrollIntoViewIfNeeded();
  }

  /**
   * Get field value
   */
  async getRadioValue(fieldTag: string): Promise<string | null> {
    const checkedRadio = this.page.locator(`input[name="${fieldTag}"]:checked`);
    if (await checkedRadio.count() > 0) {
      return await checkedRadio.getAttribute('value');
    }
    return null;
  }

  /**
   * Get checkbox values
   */
  async getCheckboxValues(fieldTag: string): Promise<string[]> {
    const checkedBoxes = this.page.locator(`input[id^="${fieldTag}_"]:checked`);
    const count = await checkedBoxes.count();
    const values: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const value = await checkedBoxes.nth(i).getAttribute('value');
      if (value) values.push(value);
    }
    
    return values;
  }

  /**
   * Get text input value
   */
  async getTextValue(fieldTag: string): Promise<string> {
    return await this.page.inputValue(`input[name="${fieldTag}"]`);
  }

  /**
   * Mock API response
   */
  async mockAPIResponse(url: string, response: any) {
    await this.page.route(url, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response),
      });
    });
  }

  /**
   * Intercept API call
   */
  async interceptAPICall(url: string) {
    return this.page.waitForRequest((request) => request.url().includes(url));
  }

  /**
   * Wait for navigation after submit
   */
  async waitForNavigationAfterSubmit(expectedUrl: string) {
    await this.page.waitForURL(`**${expectedUrl}`, { timeout: 10000 });
  }

  /**
   * Take screenshot with name
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}.png`,
      fullPage: true 
    });
  }

  /**
   * Get form data from local storage
   */
  async getFormDataFromLocalStorage(): Promise<any> {
    return await this.page.evaluate(() => {
      const data = localStorage.getItem('teleform_user_data');
      return data ? JSON.parse(data) : null;
    });
  }
}

