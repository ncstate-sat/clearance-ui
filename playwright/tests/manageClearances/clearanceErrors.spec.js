import { test, expect } from '@playwright/test'
import { ManageClearancesPage } from '../../pages/ManageClearancesPage'

// TODO mock post requests and/or use real post requests on a seeded test DB 
test.skip('handle an error assigning a clearance', async ({ page }) => {
    const manageClearancesPage = new ManageClearancesPage(page)
    await manageClearancesPage.goto()

    await manageClearancesPage.routePersonnelRequest()

    await manageClearancesPage.searchForPerson('rsemmle')
    // this will click on the search result that pops up in the search bar, matching the string after "text="
    await manageClearancesPage.clickOnSearchResult('text=Ryan Semmler (rsemmle@ncsu.edu) [001132807]')

    await manageClearancesPage.searchForClearance('ClearanceA')
    await manageClearancesPage.clickOnSearchResult('text=ClearanceAAA')
    await manageClearancesPage.assignClearanceButton.click()

    await expect(manageClearancesPage.assignedClearanceFailureToast).toBeVisible()

    await manageClearancesPage.unroutePersonnelRequest()
  })

  test.skip('handle an error revoking a clearance assignment', async ({
    page,
  }) => {
    const manageClearancesPage = new ManageClearancesPage(page)
    await manageClearancesPage.goto()

    await manageClearancesPage.routePersonnelRequest()

    await manageClearancesPage.searchForPerson('rsemmle')
    // this will click on the search result that pops up in the search bar, matching the the string after "text="
    await manageClearancesPage.clickOnSearchResult('text=Ryan Semmler (rsemmle@ncsu.edu) [001132807]')

    await manageClearancesPage.searchForClearance('ClearanceA')
    await manageClearancesPage.clickOnSearchResult('text=ClearanceAAA')
    await manageClearancesPage.assignClearanceButton.click()

    await expect(manageClearancesPage.assignedClearanceSuccessToast).toBeVisible()

    await manageClearancesPage.revokeButton.click()

    await expect(manageClearancesPage.revokeFailureToast).toBeVisible()

    await manageClearancesPage.unroutePersonnelRequest()
  })