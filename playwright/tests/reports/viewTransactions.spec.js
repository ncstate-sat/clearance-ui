import { test, expect } from '@playwright/test'
import { ReportsPage } from '../../pages/ReportsPage'

test('access the `reports` page as an admin', async ({ page }) => {
    const reportsPage = new ReportsPage(page)
    await reportsPage.goto()
    
    await reportsPage.routeTransactionsRequest()

    await reportsPage.transactionsButton.click()

    await expect(reportsPage.mockedTransactionEntry).toBeVisible()
    
    await reportsPage.unrouteTransactionsRequest()
})