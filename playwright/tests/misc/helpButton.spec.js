import { test, expect } from '@playwright/test'
import { ManageClearancesPage } from '../../pages/ManageClearancesPage'

test('submit a help ticket via the `Help` button', async ({ page }) => {
  const managePage = new ManageClearancesPage(page)
  await managePage.goto()
  await expect(page).toHaveURL(/.*manage/)

  await managePage.routeHelpRequest()

  const helpButton = await page.getByTestId('universal-help-button')
  await helpButton.click()

  const subjectField = await page.getByTestId('help-subject-field')
  const bodyField = await page.getByTestId('help-body-field')
  const submitButton = await page.getByRole('button', { name: 'Submit' })

  await subjectField.fill('test subject')
  await bodyField.fill('test body')
  await submitButton.click()

  const successToast = await page.getByRole('heading', {
    name: 'A new help ticket has been created.',
  })
  await expect(successToast).toBeVisible()

  await managePage.unrouteHelpRequest()
})
