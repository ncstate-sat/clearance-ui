import { test, expect } from '@playwright/test'
import { AdminPage } from '../../pages/AdminPage'

test('attempt to remove self from admins', async ({ page }) => {
    const adminPage = new AdminPage(page)
    await adminPage.goto()

    await expect(adminPage.userRevokeButton).toBeDisabled()

})