import { test, expect } from '@playwright/test';

test.describe('Council Proposals Dashboard', () => {
  test('should load and display proposals from local JSON', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page.locator('h1')).toContainText('Personal Masternode Generator');
    
    // Check dashboard subtitle
    await expect(page.locator('text=Council Proposals Dashboard')).toBeVisible();
    
    // Wait for proposals to load
    await expect(page.locator('h2')).toContainText('Active Proposals');
    
    // Verify at least one proposal is displayed
    await expect(page.locator('h3').first()).toBeVisible();
    
    // Check that proposal titles are visible
    await expect(page.locator('text=Upgrade Network Infrastructure')).toBeVisible();
  });

  test('should display proposal details', async ({ page }) => {
    await page.goto('/');
    
    // Wait for proposals to load
    await page.waitForSelector('h3');
    
    // Check for status information
    await expect(page.locator('text=Status:')).toBeVisible();
    
    // Check for votes information
    await expect(page.locator('text=Votes:')).toBeVisible();
    await expect(page.locator('text=Approve:')).toBeVisible();
  });

  test('should work offline without network errors', async ({ page }) => {
    // Set offline mode (this ensures we're using local JSON)
    await page.context().setOffline(true);
    
    await page.goto('/');
    
    // Should still load and display content from local JSON
    await expect(page.locator('h1')).toContainText('Personal Masternode Generator');
    
    // Should not show error messages
    const errorText = page.locator('text=Error:');
    await expect(errorText).not.toBeVisible();
  });
});
