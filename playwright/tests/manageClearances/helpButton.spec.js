import { test, expect } from '@playwright/test'
import { ManageClearancesPage } from '../../pages/ManageClearancesPage'

test('help button should open a new NCSU page', async ({ page, context }) => {
    const manageClearancesPage = new ManageClearancesPage(page)
    await manageClearancesPage.goto()
    
    const pagePromise = context.waitForEvent('page')
    await manageClearancesPage.helpButton.click()

    const helpPage = await pagePromise
    await helpPage.waitForLoadState()

    // TODO assert the title once github login is no longer necessary
    await expect(helpPage).toHaveURL(/.github.ncsu.edu/)
})