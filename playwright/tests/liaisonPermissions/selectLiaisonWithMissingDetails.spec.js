import { test, expect } from '@playwright/test'
import { LiaisonPermissionsPage } from '../../pages/LiaisonPermissionsPage'

test('select liaison with missing details', async ({ page }) => {
  const liaisonPermissionsPage = new LiaisonPermissionsPage(page)
  await liaisonPermissionsPage.goto()

  await liaisonPermissionsPage.routePersonnelRequestWithMissingDetails()

  await liaisonPermissionsPage.searchForLiaison('Missing')
  // this will click on the search result that pops up in the search bar, matching the string after "text="
  await liaisonPermissionsPage.clickOnSearchResult('text=Missing [100015229]')

  await expect(liaisonPermissionsPage.mockedLiaisonEntry).toBeVisible()

  await liaisonPermissionsPage.unroutePersonnelRequestWithMissingDetails()
})
