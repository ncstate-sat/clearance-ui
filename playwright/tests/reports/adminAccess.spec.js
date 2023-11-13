import { test, expect } from '@playwright/test'
import { ReportsPage } from '../../pages/ReportsPage'

test('access the `reports` page as an admin', async ({ page }) => {
    const reportsPage = new ReportsPage(page)
    await reportsPage.goto()
    await expect(page).toHaveURL(/.*reports/)

    await expect(reportsPage.pageHeader).toContainText('Reports')
})