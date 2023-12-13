import { test, expect } from '@playwright/test'
import { ManageClearancesPage } from '../../pages/ManageClearancesPage'

test.skip('bulk upload multiple persons', async ({ page }) => {
  const manageClearancesPage = new ManageClearancesPage(page)
  await manageClearancesPage.goto()

  await manageClearancesPage.chooseCSVButton.click()
  await manageClearancesPage.uploadPersonnelCSV()

  await expect(manageClearancesPage.bulkUploadTable).toContainText(
    'doesnotexist'
  )
})
