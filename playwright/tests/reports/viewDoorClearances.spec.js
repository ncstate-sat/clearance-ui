import { test, expect } from '@playwright/test'
import { ReportsPage } from '../../pages/ReportsPage'

test('access the `reports` page as an admin', async ({ page }) => {
    const reportsPage = new ReportsPage(page)
    await reportsPage.goto()
    
    await reportsPage.routeDoorClearancesRequest()

    await reportsPage.doorClearancesButton.click()

    await expect(reportsPage.mockedClearanceEntry).toBeVisible()
    
    await reportsPage.unrouteDoorClearancesRequest()
})