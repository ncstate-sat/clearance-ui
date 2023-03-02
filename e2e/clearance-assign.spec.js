import { test, expect } from '@playwright/test'

test.describe('Assign Clearances page', () => {
  test.beforeEach(async ({ page }) => {
    const refreshToken = process.env['E2E_REFRESH_TOKEN']

    await page.addInitScript((rt) => {
      window.localStorage.setItem('refresh-token', rt)
    }, refreshToken)

    await page.goto('/assign')
  })

  test('assign a clearance', async ({ page }) => {
    await page.locator('[test-id="personnel-input"] input').fill('jtchampi')
    await page
      .getByText('John Champion (jtchampi@ncsu.edu) [200103374]')
      .click()

    await page.locator('[test-id="clearance-input"] input').fill('vrb')
    await page.locator('//div[@id="TagInputAutocomplete-0-item-0"]').click()

    await page.locator('[test-id=assign-clearance-btn]').click()

    await expect(
      page.getByRole('heading', { name: 'Request Submitted' })
    ).toBeVisible()
  })

  test('assign a clearance to bulk users', async ({ page }) => {
    await page.getByTestId('bulk-select-switch').click()
    await page
      .getByTestId('bulk-personnel-textarea')
      .fill('jtchampi\nstaylor8\nrsemmle\nzwhelton')
    await page.getByTestId('bulk-verify-btn').click()
    await expect(page.getByTestId('verify-success-icon')).toHaveCount(3)

    await page.locator('[test-id="clearance-input"] input').fill('vrb')
    await page.locator('//div[@id="TagInputAutocomplete-0-item-0"]').click()

    await page.locator('[test-id=assign-clearance-btn]').click()

    await expect(
      page.getByRole('heading', { name: 'Request Submitted' })
    ).toBeVisible()
  })
})
