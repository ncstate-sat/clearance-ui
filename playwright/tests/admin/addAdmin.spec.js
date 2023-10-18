import { test, expect } from '@playwright/test'
import { AdminPage } from '../../pages/AdminPage'

// TODO: Remove John's info from E2E tests
test('add an admin', async ({ page }) => {

    // await page.route(/\/personnel\?search=jtchampi/, async (route) => {
    //     await route.fulfill({
    //         status: 200,
    //         contentType: 'application/json',
    //         body: JSON.stringify({
    //             personnel: [
    //                 {
    //                     first_name: 'Shawn',
    //                     middle_name: '',
    //                     last_name: 'Taylor',
    //                     email: 'staylor8@ncsu.edu',
    //                     campus_id: '001120834',
    //                 },
    //             ],
    //         }),
    //     })
    // })
    const adminPage = new AdminPage(page)
    await adminPage.goto()

    await page
        .locator('[test-id="add-admin-input"] input')
        .fill('jtchampi')

    await page
        .locator('text=John Champion (jtchampi@ncsu.edu) [200103374]')
        .click()

    // await page
    //     .locator('text=Shawn Taylor (staylor8@ncsu.edu) [001120834]')
    //     .click()

    // await page.locator('[test-id="add-admin-btn"]').click()

    // await expect(page.locator('[test-id="admin-table"]')).toContainText(
    //     'jtchampi@ncsu.edu'
    // )

    await page.unroute(/\/people\?search=staylor8/)

})