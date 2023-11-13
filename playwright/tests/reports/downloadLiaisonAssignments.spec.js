import { test, expect } from '@playwright/test'
import { ReportsPage } from '../../pages/ReportsPage'

test('access the `reports` page as an admin', async ({ page }) => {
    const reportsPage = new ReportsPage(page)
    await reportsPage.goto()
    await expect(page).toHaveURL(/.*reports/)

    await reportsPage.downloadLiaisonAssignmentsButton.click()

    await page.waitForEvent('download')
})