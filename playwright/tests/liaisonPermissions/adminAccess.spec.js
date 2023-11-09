import { test, expect } from '@playwright/test'
import { LiaisonPermissionsPage } from '../../pages/LiaisonPermissionsPage'

test('access the `liaison-permissions` page as an admin', async ({ page }) => {
    const liaisonPermissionsPage = new LiaisonPermissionsPage(page)
    await liaisonPermissionsPage.goto()
    await expect(page).toHaveURL(/.*liaison-permissions/)

    await expect(liaisonPermissionsPage.pageHeader).toContainText('Liaison Permissions')
})