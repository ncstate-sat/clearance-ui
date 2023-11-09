import { test, expect } from '@playwright/test'
import { LiaisonPermissionsPage } from '../../pages/LiaisonPermissionsPage'

test.skip('give and revoke a permission', async ({
  page,
}) => {
  const liaisonPermissionsPage = new LiaisonPermissionsPage(page)
  await liaisonPermissionsPage.goto()

  await liaisonPermissionsPage.routePersonnelRequest()
  await liaisonPermissionsPage.routeClearanceSearchRequest()
  await liaisonPermissionsPage.routeAssignmentRequest()
  await liaisonPermissionsPage.routeRoleAccountRequest()
  await liaisonPermissionsPage.routeUpdateRoleRequest()

  await liaisonPermissionsPage.searchForLiaison('fakep')
  // this will click on the search result that pops up in the search bar, matching the string after "text="
  await liaisonPermissionsPage.clickOnSearchResult('text=Fake Person (fakep@ncsu.edu) [000000000]')

  await liaisonPermissionsPage.searchForClearance('testc')
  await liaisonPermissionsPage.clickOnSearchResult('text=testclearance')

  await expect(liaisonPermissionsPage.permissionsAssignedHeader).toBeVisible()

  await liaisonPermissionsPage.revokeButton.click()

  await expect(liaisonPermissionsPage.revocationSucceededHeader).toBeVisible()

  await liaisonPermissionsPage.unroutePersonnelRequest()
  await liaisonPermissionsPage.unrouteClearanceSearchRequest()
  await liaisonPermissionsPage.unrouteAssignmentRequest()
  await liaisonPermissionsPage.unrouteRoleAccountRequest()
  await liaisonPermissionsPage.unrouteUpdateRoleRequest()
})