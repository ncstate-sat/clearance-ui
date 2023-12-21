import { test, expect } from '@playwright/test'
import { LiaisonPermissionsPage } from '../../pages/LiaisonPermissionsPage'

test('hide permissions from the clearance picker that have already been assigned', async ({
  page,
}) => {
  // Go to the page
  const liaisonPermissionsPage = new LiaisonPermissionsPage(page)
  await liaisonPermissionsPage.goto()

  // Select a person known to have permissions
  await liaisonPermissionsPage.routePersonnelRequest()
  await liaisonPermissionsPage.routeLiaisonRequest()
  await liaisonPermissionsPage.routeClearanceSearchRequestMultiple()
  await liaisonPermissionsPage.searchForLiaison('fakep')
  await liaisonPermissionsPage.clickOnSearchResult(
    'text=Fake Person (fakep@ncsu.edu) [000000000]'
  )

  // Search in the clearance picker for that clearance, ensuring one of those clearances is in the response\
  await liaisonPermissionsPage.searchForClearance('Clearance')

  const cCount = await await page.$$eval('body', (elements) =>
    elements.reduce((count, element) => {
      const textContent = element.textContent || ''
      return count + (textContent.includes('ClearanceC') ? 1 : 0)
    }, 0)
  )

  expect(cCount).toEqual(1)

  await liaisonPermissionsPage.unroutePersonnelRequest()
  await liaisonPermissionsPage.unrouteLiaisonRequest()
})
