import { test, expect } from '@playwright/test'
import { ReportsPage } from '../../pages/ReportsPage'

test('display a toast if an error occurs in the people clarances page', async ({
  page,
}) => {
  const reportsPage = new ReportsPage(page)
  await reportsPage.goto()

  await reportsPage.routePeopleClearancesRequestError()

  await reportsPage.peopleClearancesButton.click()

  const errorMessage = await reportsPage.getHeading(
    '[TEST] Could not do the thing.'
  )

  await expect(errorMessage).toBeVisible()

  await reportsPage.unroutePeopleClearancesRequest()
})
