import { test, expect } from '@playwright/test';

test.describe('Discovery Flow', () => {
  test('should navigate from home to destination results via vibe discovery', async ({ page }) => {
    // 1. Start at the landing page
    await page.goto('/');

    // 2. Journey into "Vibe-First" discovery
    // Using Regex for resilience against line breaks in the button text
    const vibeTrigger = page.getByRole('button', { name: /I have a feeling/i });
    await expect(vibeTrigger).toBeVisible();
    await vibeTrigger.click();

    // 3. Verify we are on the Vibe Discovery page
    await expect(page).toHaveURL(/\/discover\/vibe/);
    await expect(page.getByText(/Where is the ADVENTURE leading today/i)).toBeVisible({ timeout: 10000 });

    // 4. Select attributes to build "Travel DNA"
    
    // Select a Month
    // Target the button inside the main element to avoid ambiguity with the SessionStateBar
    await page.locator('main').getByRole('button', { name: 'April' }).click();
    
    // Select a Vibe Card
    // The cards are clickable and contain the vibe name.
    await page.getByText(/^serene$/i).first().click();
    
    // Select an Occasion
    await page.getByRole('button', { name: /Solo Soul-Searching/i }).click();

    // 5. Verify the Slide-up Location Panel appears (auto-triggered by 3 actions)
    const locationPanel = page.getByText(/One last thing/i);
    await expect(locationPanel).toBeVisible({ timeout: 10000 });

    // 6. Enter origin location
    // Fill origin - Wait a moment for the animation to settle if needed
    const originInput = page.getByPlaceholder(/Street, City, or Airport/i);
    await expect(originInput).toBeVisible();
    
    // Direct interaction to avoid scrolling issues during animation
    await originInput.fill('San Francisco');
    
    // Click Go
    const goButton = page.getByRole('button', { name: /^Go$/i });
    await expect(goButton).toBeEnabled();
    await goButton.click({ force: true });

    // 7. Verify we landed on the candidates page
    await expect(page).toHaveURL(/\/discover\/vibe\/candidates/, { timeout: 15000 });
    
    // Assert that we see destination cards
    await expect(page.getByText(/Handpicked for your/i)).toBeVisible();
    await expect(page.getByText(/current state of mind/i)).toBeVisible();
    
    // Check if at least one destination card is present
    await expect(page.locator('div.group').filter({ hasText: /Explore/i }).first()).toBeVisible();
  });

  test('should navigate from home to constraint-first discovery', async ({ page }) => {
    await page.goto('/');

    // Journey into "Constraint-First" discovery
    const constraintTrigger = page.getByRole('button', { name: /I know my budget/i });
    await expect(constraintTrigger).toBeVisible();
    await constraintTrigger.click();

    // Verify we are on the Constraints page
    await expect(page).toHaveURL(/\/discover\/constraints/);
    await expect(page.getByText(/Define Your Reality/i)).toBeVisible();

    // Must select dates to enable the "Show me what's possible" button
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 7);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 5);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    await page.locator('input[type="date"]').first().fill(formatDate(startDate));
    await page.locator('input[type="date"]').last().fill(formatDate(endDate));

    // Click Proceed
    const proceedBtn = page.getByRole('button', { name: /Show me what's possible/i });
    await expect(proceedBtn).toBeEnabled();
    await proceedBtn.click();

    // Verify we landed on the verified destinations page
    await expect(page).toHaveURL(/\/discover\/constraints\/candidates/);
    await expect(page.getByText(/Verified Destinations/i)).toBeVisible();
  });
});
