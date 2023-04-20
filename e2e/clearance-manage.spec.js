import { test, expect } from '@playwright/test'

test.describe('[Admin] Assign & Manage Clearances page', () => {
  test.beforeEach(async ({ page }) => {
    const refreshToken = process.env['E2E_REFRESH_TOKEN']

    await page.addInitScript((rt) => {
      window.localStorage.setItem('refresh-token', rt)
    }, refreshToken)

    await page.goto('/manage')
  })

  // TODO: Remove John's info from E2E tests
  test('assign a clearance', async ({ page }) => {
    await page.locator('[test-id="personnel-input"] input').fill('jtchampi')
    await page
      .getByText('John Champion (jtchampi@ncsu.edu) [200103374]')
      .click()

    await page.locator('[test-id="clearance-input"] input').fill('vrb')
    await page.locator('//div[@id="TagInputAutocomplete-0-item-0"]').click()

    await page.locator('[test-id=assign-clearance-btn]').click()

    await expect(
      page.getByRole('heading', { name: 'Clearance(s) Assigned Successfully' })
    ).toBeVisible()
  })

  // TODO: Remove John's info from E2E tests
  test('revoke the first clearance for John', async ({ page }) => {
    await page.locator('[test-id="personnel-input"] input').fill('jtchampi')
    await page
      .getByText('John Champion (jtchampi@ncsu.edu) [200103374]')
      .click()

    await page.locator('[test-id="revoke-clearance-btn"]').first().click()

    await expect(
      page.getByRole('heading', { name: 'Revoke Succeeded' })
    ).toBeVisible()
  })
})

test.describe('[Liaison] Assign & Manage Clearances page', () => {
  test.beforeEach(async ({ page }) => {
    const refreshToken = process.env['E2E_LIAISON_REFRESH_TOKEN']

    await page.addInitScript((rt) => {
      window.localStorage.setItem('refresh-token', rt)
    }, refreshToken)

    await page.goto('/manage')
  })

  test('assign and revoke a clearance', async ({ page }) => {
    await page.locator('[test-id="personnel-input"] input').fill('staylor8')
    await page.getByText('Shawn Taylor (staylor8@ncsu.edu) [001120834]').click()

    await page.locator('[test-id="clearance-input"] input').fill('ClearanceA')
    await page.locator('//div[@id="TagInputAutocomplete-0-item-0"]').click()

    await page.locator('[test-id=assign-clearance-btn]').click()

    await expect(
      page.getByRole('heading', { name: 'Clearance(s) Assigned Successfully' })
    ).toBeVisible()

    await page.locator('[test-id="revoke-clearance-btn"]').first().click()

    await expect(
      page.getByRole('heading', { name: 'Revoke Succeeded' })
    ).toBeVisible()

    await expect(
      page.locator('[test-id="revoke-clearance-btn"]').first()
    ).toBeDisabled()
  })
})
