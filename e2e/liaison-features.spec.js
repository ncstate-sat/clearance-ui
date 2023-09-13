import { test, expect } from '@playwright/test'

test.describe('Liaison-specific features', () => {
  test.beforeEach(async ({ page }) => {
    const refreshToken = process.env['E2E_LIAISON_REFRESH_TOKEN']

    await page.addInitScript((rt) => {
      window.localStorage.setItem('refresh-token', rt)
    }, refreshToken)
  })

  test('it should show an acknowledgement modal if the user has not seen it in the previous period of time', async ({
    page,
  }) => {
    await page.route(/\/liaison\/needs-acknowledgement$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          needs_acknowledgement: true,
        }),
      })
    })

    await page.goto('/manage')

    await page.getByRole('button', { name: 'Acknowledge' }).click()

    await expect(
      page.getByRole('button', { name: 'Acknowledge' })
    ).not.toBeVisible()
  })

  test('it should not show an acknowledgement modal if the user has seen it recently', async ({
    page,
  }) => {
    await page.route(/\/liaison\/needs-acknowledgement$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          needs_acknowledgement: false,
        }),
      })
    })

    await page.goto('/manage')

    await page.waitForTimeout(1000)

    await expect(
      page.getByRole('button', { name: 'Acknowledge' })
    ).not.toBeVisible()
  })
})
