import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object class that all page objects should extend
 */
export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the page - must be implemented by child classes
   */
  abstract navigate(): Promise;

  /**
   * Get the page title
   */
  async getTitle(): Promise {
    return await this.page.title();
  }

  /**
   * Wait for the page to be fully loaded
   */
  async waitForPageLoad(): Promise {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise {
    return this.page.url();
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(name: string): Promise {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}