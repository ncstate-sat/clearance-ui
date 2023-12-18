import { test, expect } from '@playwright/test'
import { ReportsPage } from '../../pages/ReportsPage'

test('access the door reports page with a filter', async ({ page }) => {
  const reportsPage = new ReportsPage(page)
  await reportsPage.goto()

  await reportsPage.routeDoorClearancesRequest()
  await reportsPage.routeFilteredDoorClearancesRequest()

  await reportsPage.doorClearancesButton.click()

  const textbox = await page.getByRole('textbox')
  await textbox.fill('VRB')

  await page.getByText('VRB-B-B103B-Test Door 1').first().click()

  await page.waitForTimeout(1000)

  const visibleClearance = await page.getByText('ClearanceB')
  const invisibleClearance = await page.getByText('ClearanceC')

  expect(visibleClearance).toBeVisible()
  expect(invisibleClearance).not.toBeVisible()

  // await reportsPage.unrouteDoorClearancesRequest()
  await reportsPage.unrouteFilteredDoorClearancesRequest()
})
