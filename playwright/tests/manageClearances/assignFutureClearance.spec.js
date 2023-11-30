import { test, expect } from '@playwright/test'
import { ManageClearancesPage } from '../../pages/ManageClearancesPage'

test('assign a clearance for a future date', async ({ page }) => {
  const manageClearancesPage = new ManageClearancesPage(page)
  await manageClearancesPage.goto()

  await manageClearancesPage.routePersonnelRequest()
  await manageClearancesPage.routeClearanceSearchRequest()
  await manageClearancesPage.routeAssignmentRequest()
  await manageClearancesPage.routeRevocationRequest()

  await manageClearancesPage.searchForPerson('jtchampi')
  // this will click on the search result that pops up in the search bar, matching the string after "text="
  await manageClearancesPage.clickOnSearchResult(
    'text=John Champion (jtchampi@ncsu.edu) [200103374]'
  )

  await manageClearancesPage.searchForClearance('VRB-Test')
  await manageClearancesPage.clickOnSearchResult('text="VRB-Test Clearance 1"')
  await manageClearancesPage.splitButtonDropdown.click()
  await manageClearancesPage.assignFutureOption.click()

  await manageClearancesPage.startDateNode.click()
  await manageClearancesPage.startDateTextbox.fill('11-29-2033 3:27 PM')

  await manageClearancesPage.assignFutureClearanceButton.click()

  // TODO mock post requests and/or use real post requests on a seeded test DB
  await expect(manageClearancesPage.assignedClearanceSuccessToast).toBeVisible()

  await manageClearancesPage.unroutePersonnelRequest()
  await manageClearancesPage.unrouteClearanceSearchRequest()
  await manageClearancesPage.unrouteAssignmentRequest()
  await manageClearancesPage.unrouteRevocationRequest()
})
