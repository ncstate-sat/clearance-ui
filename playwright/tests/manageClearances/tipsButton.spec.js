import { test, expect } from '@playwright/test'
import { ManageClearancesPage } from '../../pages/ManageClearancesPage'

test('tips button should open a new Google Sites page', async ({
  page,
  context,
}) => {
  const manageClearancesPage = new ManageClearancesPage(page)
  await manageClearancesPage.goto()

  const pagePromise = context.waitForEvent('page')
  await manageClearancesPage.tipsButton.click()

  const helpPage = await pagePromise
  await helpPage.waitForLoadState()

  // TODO assert the title once github login is no longer necessary
  await expect(helpPage).toHaveURL(/\.google\.com/)
})
