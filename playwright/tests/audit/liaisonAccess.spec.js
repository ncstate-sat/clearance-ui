import { test, expect } from '@playwright/test'
import { AuditLogPage } from '../../pages/AuditLogPage'
import { ManageClearancesPage } from '../../pages/ManageClearancesPage'

test('deny access to the `audit` page as a liaison', async ({ page }) => {
    // use different token for liaison access
    const refreshToken = process.env['E2E_LIAISON_REFRESH_TOKEN']

    await page.addInitScript((rt) => {
      window.localStorage.setItem('refresh-token', rt)
    }, refreshToken)

    const auditLogPage = new AuditLogPage(page)
    await auditLogPage.goto()
    // should be redirected to 'manage' page instead of 'admin'
    await expect(page).toHaveURL(/.*manage/)

    const manageClearancesPage = new ManageClearancesPage(page)
    await expect(manageClearancesPage.pageHeader).toContainText('Assign & Manage Clearances')
})