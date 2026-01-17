import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for SauceDemo Inventory (Products) page
 */
export class DashboardPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly menuButton: Locator;
  private readonly logoutButton: Locator;
  private readonly shoppingCart: Locator;
  private readonly inventoryItems: Locator;

  constructor(page: Page) {
    super(page);
    
    this.pageTitle = page.locator('.title');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutButton = page.locator('[data-test="logout-sidebar-link"]');
    this.shoppingCart = page.locator('.shopping_cart_link');
    this.inventoryItems = page.locator('.inventory_item');
  }

  /**
   * Navigate to the inventory/dashboard page
   */
  async navigate(): Promise<void> {
    await this.page.goto('/inventory.html');
    await this.waitForPageLoad();
  }

  /**
   * Get the page title text
   */
  async getPageTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  /**
   * Open the hamburger menu
   */
  async openMenu(): Promise<void> {
    await this.menuButton.click();
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutButton.click();
  }

  /**
   * Check if user is on the inventory page
   */
  async isOnInventoryPage(): Promise<boolean> {
    return await this.pageTitle.isVisible();
  }

  /**
   * Get count of products displayed
   */
  async getProductCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  /**
   * Get shopping cart badge count
   */
  async getCartItemCount(): Promise<string> {
    const badge = this.page.locator('.shopping_cart_badge');
    const isVisible = await badge.isVisible();
    if (!isVisible) return '0';
    return await badge.textContent() || '0';
  }
}