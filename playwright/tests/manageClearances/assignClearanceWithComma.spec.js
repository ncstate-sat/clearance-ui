import { test, expect } from '@playwright/test'
import { ManageClearancesPage } from '../../pages/ManageClearancesPage'

test('select clearance containing commas', async ({ page }) => {
  const manageClearancesPage = new ManageClearancesPage(page)
  await manageClearancesPage.goto()

  await manageClearancesPage.routePersonnelRequest()
  await manageClearancesPage.routeClearanceSearchRequestWithCommas()

  await manageClearancesPage.searchForPerson('fakep')
  // this will click on the search result that pops up in the search bar, matching the string after "text="
  await manageClearancesPage.clickOnSearchResult(
    'text=Fake Person (fakep@ncsu.edu) [000000000]'
  )

  await manageClearancesPage.searchForClearance('MRC')
  await manageClearancesPage.clickOnSearchResult(
    'text=MRC-ECE 401/A, 446, 454, 454D-DEPT'
  )

  await expect(manageClearancesPage.mockedClearanceEntry).toBeVisible()

  await manageClearancesPage.unroutePersonnelRequest()
  await manageClearancesPage.unrouteClearanceSearchRequestWithCommas()
})
