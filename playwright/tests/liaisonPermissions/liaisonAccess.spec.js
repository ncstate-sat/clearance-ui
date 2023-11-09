import { test, expect } from '@playwright/test'
import { LiaisonPermissionsPage } from '../../pages/LiaisonPermissionsPage'
import { ManageClearancesPage } from '../../pages/ManageClearancesPage'

test('deny access to the `liaison-permissions` page as a liaison', async ({ page }) => {
    // use different token for liaison access
    const refreshToken = process.env['E2E_LIAISON_REFRESH_TOKEN']

    await page.addInitScript((rt) => {
      window.localStorage.setItem('refresh-token', rt)
    }, refreshToken)

    const liaisonPermissionsPage = new LiaisonPermissionsPage(page)
    await liaisonPermissionsPage.goto()
    // should be redirected to 'manage' page instead of 'liaison-permissions'
    await expect(page).toHaveURL(/.*manage/)

    const manageClearancesPage = new ManageClearancesPage(page)
    await expect(manageClearancesPage.pageHeader).toContainText('Assign & Manage Clearances')
})