import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('SauceDemo Login Flow Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Arrange - SauceDemo credentials
    const username = 'standard_user';
    const password = 'secret_sauce';

    // Act
    await loginPage.fillUsername(username);
    await loginPage.fillPassword(password);
    await loginPage.clickLogin();

    // Assert - URL navigation
    await expect(page).toHaveURL(/.*inventory.html/);
    
    // Assert - Dashboard title is visible
    const title = await dashboardPage.getPageTitle();
    expect(title).toBe('Products');
    
    // Assert - Products are loaded
    const productCount = await dashboardPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    // Act
    await loginPage.login('invalid_user', 'wrong_password');

    // Assert - Error message appears
    await expect(loginPage.isErrorVisible()).resolves.toBe(true);
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username and password do not match');
  });

  test('should show error with locked out user', async ({ page }) => {
    // Act - SauceDemo has a locked_out_user for testing
    await loginPage.login('locked_out_user', 'secret_sauce');

    // Assert
    await expect(loginPage.isErrorVisible()).resolves.toBe(true);
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Sorry, this user has been locked out');
  });

  test('should show error with empty username', async ({ page }) => {
    // Act
    await loginPage.fillPassword('secret_sauce');
    await loginPage.clickLogin();

    // Assert - Validation error
    await expect(loginPage.isErrorVisible()).resolves.toBe(true);
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username is required');
  });

  test('should show error with empty password', async ({ page }) => {
    // Act
    await loginPage.fillUsername('standard_user');
    await loginPage.clickLogin();

    // Assert
    await expect(loginPage.isErrorVisible()).resolves.toBe(true);
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Password is required');
  });

  test('should successfully logout after login', async ({ page }) => {
    // Arrange & Act - Login first
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory.html/);
    
    // Act - Logout
    await dashboardPage.logout();

    // Assert - Back to login page
    await expect(page).toHaveURL(/^https:\/\/www\.saucedemo\.com\/?$/);
  });

  test('should display correct number of products after login', async ({ page }) => {
    // Act
    await loginPage.login('standard_user', 'secret_sauce');

    // Assert - SauceDemo shows 6 products
    const productCount = await dashboardPage.getProductCount();
    expect(productCount).toBe(6);
  });
});