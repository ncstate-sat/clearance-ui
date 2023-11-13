import { test, expect } from '@playwright/test'
import { ManageClearancesPage } from '../../pages/ManageClearancesPage'

test('access the `manage` page as an admin', async ({ page }) => {
    const manageClearancesPage = new ManageClearancesPage(page)
    await manageClearancesPage.goto()
    await expect(page).toHaveURL(/.*manage/)

    await expect(manageClearancesPage.pageHeader).toContainText('Assign & Manage Clearances')
})