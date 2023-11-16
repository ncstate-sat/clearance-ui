import { test, expect } from '@playwright/test'
import { ManageClearancesPage } from '../../pages/ManageClearancesPage'

test('select person with missing details', async ({ page }) => {
  const manageClearancesPage = new ManageClearancesPage(page)
  await manageClearancesPage.goto()

  await manageClearancesPage.routePersonnelRequestWithMissingDetails()

  await manageClearancesPage.searchForPerson('Missing')
  // this will click on the search result that pops up in the search bar, matching the string after "text="
  await manageClearancesPage.clickOnSearchResult('text=Missing [100015229]')

  await expect(manageClearancesPage.mockedPersonnelEntry).toBeVisible()

  await manageClearancesPage.unroutePersonnelRequestWithMissingDetails()
})
