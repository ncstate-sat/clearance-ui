import { test, expect } from '@playwright/test'

test.describe('Audit Log page', () => {
  test.beforeEach(async ({ page }) => {
    const refreshToken = process.env['E2E_REFRESH_TOKEN']

    await page.addInitScript((rt) => {
      window.localStorage.setItem('refresh-token', rt)
    }, refreshToken)

    await page.goto('/audit')
    
  })

  test('it should display four columns and at least one row', async ({
    page,
  }) => {

    //Make sure the page is loaded.
    await expect(page.getByRole('heading', { name: 'Audit Log' })).toBeVisible();
    
    // Make sure we have four columns.
    const headerCells = await page.getByTestId('table-header').count()
    expect(headerCells).toBe(4)

    // Make sure at least one row rendered.
    await page.waitForLoadState('networkidle')
    const rows = await page.getByTestId('table-row').count()
    expect(rows).toBeGreaterThan(0)

    // Make sure there are no blank cells.
    const cells = await page.getByTestId('table-cell').allInnerTexts()
    expect(cells.filter((c) => c.trim().length === 0).length).toBe(0)
  })

  test('add filters', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Filter' }).click()

    // Add 'Select Person' filter
    await page.getByText('Filter by Person').click()
    await expect(page.getByText('Select Person')).toBeVisible()

    // Add 'Select Assigner' filter
    await page.getByText('Filter by Assigner').click()
    await expect(page.getByText('Select Assigner')).toBeVisible()

    await page.getByText('Filter by Clearance Name').click()
    await expect(page.getByText('Search Clearances')).toBeVisible()

    await page.getByText('Filter by Timeframe').click()
    await expect(page.getByText('Search Timeframe')).toBeVisible()
  })

  test('clear filters', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Filter' }).click()

    // Add 'Select Person' filter
    await page.getByText('Filter by Person').click()
    await expect(page.getByText('Select Person')).toBeVisible()

    // Add 'Select Assignee' filter
    await page.getByText('Filter by Assigner').click()

    await page.getByText('Filter by Clearance Name').click()
    await expect(page.getByText('Search Clearances')).toBeVisible()

    await page.getByText('Filter by Timeframe').click()
    await expect(page.getByText('Search Timeframe')).toBeVisible()

    // Test Clear Filters
    await page.getByText('Clear Filters').click()

    // Every filter should be gone
    await expect(page.getByText('Select Person')).not.toBeVisible()
    await expect(page.getByText('Select Assignee')).not.toBeVisible()
    await expect(page.getByText('Search Clearances')).not.toBeVisible()
    await expect(page.getByText('Search Timeframe')).not.toBeVisible()
  })

  test('remove filter using the "x" button', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Filter' }).click()

    // Add 'Select Person' filter
    await page.getByText('Filter by Person').click()
    await expect(page.getByText('Select Person')).toBeVisible()

    // Add 'Search Timeframe' filter
    await page.getByText('Filter by Timeframe').click()
    await expect(page.getByText('Search Timeframe')).toBeVisible()

    // Dismiss menu
    await page.getByRole('button', { name: 'Add Filter' }).click()

    // Remove 'Select Person' filter
    await page.getByTestId('remove-filter-btn').first().click()
    await expect(page.getByText('Select Person')).not.toBeVisible()

    // Remove 'Search Timeframe' filter
    await page.getByTestId('remove-filter-btn').first().click()
    await expect(page.getByText('Search Timeframe')).not.toBeVisible()
  })
})
