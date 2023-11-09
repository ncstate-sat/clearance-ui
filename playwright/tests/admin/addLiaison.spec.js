import { test, expect } from '@playwright/test'
import { AdminPage } from '../../pages/AdminPage'

test('add a liaison', async ({ page }) => {
    const adminPage = new AdminPage(page)
    await adminPage.goto()

    await adminPage.routePersonnelRequest()

    await adminPage.searchForPerson('fakep')
    // this will click on the search result that pops up in the search bar, matching the the string after "text="
    await adminPage.clickOnPerson('text=Fake Person (fakep@ncsu.edu) [000000000]')
    await adminPage.addLiaisonButton.click()

    await expect(adminPage.liaisonTable).toContainText('fakep@ncsu.edu')

    await adminPage.unroutePersonnelRequest()
})