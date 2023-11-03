import { test, expect } from '@playwright/test'
import { AdminPage } from '../../pages/AdminPage'

test('access the `admin` page as an admin', async ({ page }) => {
    const adminPage = new AdminPage(page)
    await adminPage.goto()
    await expect(page).toHaveURL(/.*admin/)

    await expect(adminPage.pageHeader).toContainText('Manage Users')
})