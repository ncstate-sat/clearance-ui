import { test, expect } from '@playwright/test'
import { ManageClearancesPage } from '../../pages/ManageClearancesPage'

test('show an acknowledgement modal if the user has not seen it in the previous time period', async ({ page, context }) => {
    // use different token for liaison access
    const refreshToken = process.env['E2E_LIAISON_REFRESH_TOKEN']
    await page.addInitScript((rt) => {
      window.localStorage.setItem('refresh-token', rt)
    }, refreshToken)

    const manageClearancesPage = new ManageClearancesPage(page)
    await manageClearancesPage.goto()

    await manageClearancesPage.routeUnseenAckRequest()

    // hitting escape shouldn't let you dismiss the modal
    await page.keyboard.press('Escape')

    await expect(manageClearancesPage.ackModal).toBeVisible()

    await manageClearancesPage.ackModal.click()

    await expect(manageClearancesPage.ackModal).not.toBeVisible()

    await manageClearancesPage.unrouteAckRequest() 
})