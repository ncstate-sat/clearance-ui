import { test, expect } from '@playwright/test'

test.describe('Reports Page', () => {
  test.beforeEach(async ({ page }) => {
    const refreshToken = process.env['E2E_REFRESH_TOKEN']

    await page.addInitScript((rt) => {
      window.localStorage.setItem('refresh-token', rt)
    }, refreshToken)
  })

  test('it should download the liaison assignments report when the button is clicked', async ({
    page,
  }) => {
    await page.goto('/reports')

    await page.locator('[test-id=liaison-assignments-download-btn]').click()

    await page.waitForEvent('download')
  })
})
