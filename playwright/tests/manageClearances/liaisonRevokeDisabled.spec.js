import { test, expect } from '@playwright/test'
import { ManageClearancesPage } from '../../pages/ManageClearancesPage'

test.skip('verify revoke buttons are disabled as a liaison', async ({ page }) => {
    const manageClearancesPage = new ManageClearancesPage(page)
    await manageClearancesPage.goto()
})