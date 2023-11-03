import { test, expect } from '@playwright/test'
import { ManageClearancesPage } from '../../pages/ManageClearancesPage'

test('assign and revoke a clearance as an admin', async ({ page }) => {
    const manageClearancesPage = new ManageClearancesPage(page)
    await manageClearancesPage.goto()

    await manageClearancesPage.routePersonnelRequest()
    await manageClearancesPage.routeClearanceSearchRequest()
    await manageClearancesPage.routeAssignmentRequest()
    await manageClearancesPage.routeRevocationRequest()

    await manageClearancesPage.searchForPerson('fakep')
    // this will click on the search result that pops up in the search bar, matching the string after "text="
    await manageClearancesPage.clickOnSearchResult('text=Fake Person (fakep@ncsu.edu) [000000000]')

    await manageClearancesPage.searchForClearance('testc')
    await manageClearancesPage.clickOnSearchResult('text=testclearance')
    await manageClearancesPage.assignClearanceButton.click()

    // TODO mock post requests and/or use real post requests on a seeded test DB
    // await expect(manageClearancesPage.assignedClearanceSuccessToast).toBeVisible()
    await expect(manageClearancesPage.clearancesTable).toContainText('testclearance')

    await manageClearancesPage.revokeButton.click()

    // await expect(manageClearancesPage.revokeSuccessToast).toBeVisible()
    await expect(manageClearancesPage.clearancesTable).not.toContainText('testclearance')

    await manageClearancesPage.unroutePersonnelRequest()
    await manageClearancesPage.unrouteClearanceSearchRequest()
    await manageClearancesPage.unrouteAssignmentRequest()
    await manageClearancesPage.unrouteRevocationRequest()
})