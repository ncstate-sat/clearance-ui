import { test, expect } from '@playwright/test'
import { ManageClearancesPage } from '../../pages/ManageClearancesPage'

test('access the `manage` page as a liaison', async ({ page }) => {
    // use different token for liaison access
    const refreshToken = process.env['E2E_LIAISON_REFRESH_TOKEN']
    await page.addInitScript((rt) => {
      window.localStorage.setItem('refresh-token', rt)
    }, refreshToken)

    const manageClearancesPage = new ManageClearancesPage(page)
    await manageClearancesPage.goto()
    await expect(page).toHaveURL(/.*manage/)

    await expect(manageClearancesPage.pageHeader).toContainText('Assign & Manage Clearances')
})