import { test, expect } from '@playwright/test'

test.describe('Manage Admins page', () => {
  test.beforeEach(async ({ page }) => {
    const refreshToken = process.env['E2E_REFRESH_TOKEN']

    await page.addInitScript((rt) => {
      window.localStorage.setItem('refresh-token', rt)
    }, refreshToken)
  })

  // TODO: Remove John's info from E2E tests
  test.skip('add an admin', async ({ page }) => {
    await page.goto('/admin')

    await page
      .locator('[test-id="add-admin-input"] input')
      .fill('jtchampi@ncsu.edu')

    await page
      .locator('text=John Champion (jtchampi@ncsu.edu) [200103374]')
      .click()

    await page.locator('[test-id="add-admin-btn"]').click()

    await expect(page.locator('[test-id="admin-table"]')).toContainText(
      'jtchampi@ncsu.edu'
    )
  })

  // TODO: Remove John's info from E2E tests
  test.skip('add a liaison', async ({ page }) => {
    await page.goto('/admin')

    await page
      .locator('[test-id="add-admin-input"] input')
      .fill('jtchampi@ncsu.edu')

    await page
      .locator('text=John Champion (jtchampi@ncsu.edu) [200103374]')
      .click()

    await page.locator('[test-id="add-liaison-btn"]').click()

    await expect(page.locator('[test-id="liaison-table"]')).toContainText(
      'jtchampi@ncsu.edu'
    )
  })

  test.skip('ensure admin user cannot self-remove from admin list', async ({
    page,
  }) => {
    await page.goto('/admin')

    const revokeButton = await page.locator(
      '[test-id="sat.admin.svc@ncsu.edu"] button'
    )

    await expect(revokeButton).toBeDisabled()
  })
})
