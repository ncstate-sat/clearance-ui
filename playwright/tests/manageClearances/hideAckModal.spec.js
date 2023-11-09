import { test, expect } from '@playwright/test'
import { ManageClearancesPage } from '../../pages/ManageClearancesPage'

test('hide an acknowledgement modal if the user has seen it in the previous time period', async ({ page, context }) => {
    const manageClearancesPage = new ManageClearancesPage(page)
    await manageClearancesPage.goto()

    await manageClearancesPage.routeSeenAckRequest()

    await expect(manageClearancesPage.ackModal).not.toBeVisible()

    await manageClearancesPage.unrouteAckRequest() 
})