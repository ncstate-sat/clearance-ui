import { test, expect } from '@playwright/test'

test.describe('Liaison Permissions page', () => {
  test.beforeEach(async ({ page }) => {
    const refreshToken = process.env['E2E_REFRESH_TOKEN']

    await page.addInitScript((rt) => {
      window.localStorage.setItem('refresh-token', rt)
    }, refreshToken)

    await page.goto('/liaison-permissions')
  })

  // TODO: Remove John's info from E2E tests
  test('view liaison permissions, add a permission, and remove a permission', async ({
    page,
  }) => {
    await page.locator('#TagInput-2').fill('jtchampi')
    await page
      .getByText('John Champion (jtchampi@ncsu.edu) [200103374]')
      .click()

    await page.locator('#TagInput-4').fill('ClearanceA')
    await page.locator('//div[@id="TagInputAutocomplete-0-item-0"]').click()

    await page.locator('[test-id=assign-permission-btn]').click()

    await expect(
      page.getByRole('heading', { name: 'Permissions Assigned' })
    ).toBeVisible()

    await page.locator('[test-id=revoke-permission-btn]').first().click()

    await expect(
      page.getByRole('heading', { name: 'Revoke Succeeded' })
    ).toBeVisible()
  })

  // TODO: Remove John's info from E2E tests
  test('handle an error assigning a permission', async ({ page }) => {
    const ERROR_MESSAGE = '[TEST] Could not give permission.'

    await page.route(/\/liaison\/assign$/, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ detail: ERROR_MESSAGE }),
      })
    })

    await page.locator('#TagInput-2').fill('jtchampi')
    await page
      .getByText('John Champion (jtchampi@ncsu.edu) [200103374]')
      .click()

    await page.locator('#TagInput-4').fill('ClearanceA')
    await page.locator('//div[@id="TagInputAutocomplete-0-item-0"]').click()

    await page.locator('[test-id=assign-permission-btn]').click()

    await expect(
      page.getByRole('heading', { name: ERROR_MESSAGE })
    ).toBeVisible()

    const toastElement = await page.getByRole('heading', {
      name: ERROR_MESSAGE,
    })
    const color = await toastElement.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue('color')
    )
    expect(color).toBe('rgb(167, 54, 54)')
  })

  // TODO: Remove John's info from E2E tests
  test('handle an error revoking a permission', async ({ page }) => {
    const ERROR_MESSAGE = '[TEST] Could not give permission.'

    await page.route(/\/liaison\/revoke$/, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ detail: ERROR_MESSAGE }),
      })
    })

    await page.locator('#TagInput-2').fill('jtchampi')
    await page
      .getByText('John Champion (jtchampi@ncsu.edu) [200103374]')
      .click()

    await page.locator('#TagInput-4').fill('ClearanceA')
    await page.locator('//div[@id="TagInputAutocomplete-0-item-0"]').click()

    await page.locator('[test-id=assign-permission-btn]').click()

    await expect(
      page.getByRole('heading', { name: 'Permissions Assigned' })
    ).toBeVisible()

    await page.locator('[test-id=revoke-permission-btn]').first().click()

    await expect(
      page.getByRole('heading', { name: ERROR_MESSAGE })
    ).toBeVisible()

    const toastElement = await page.getByRole('heading', {
      name: ERROR_MESSAGE,
    })
    const color = await toastElement.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue('color')
    )
    expect(color).toBe('rgb(167, 54, 54)')
  })
})
