import { test, expect } from '@playwright/test'
import { AdminPage } from '../../pages/AdminPage'

// TODO: Remove John's info from E2E tests
test('add an admin', async ({ page }) => {
    const adminPage = new AdminPage(page)
    await adminPage.goto()

    await page.route(/\/personnel\?search=fakep/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                personnel: [
                    {
                        first_name: 'Fake',
                        middle_name: '',
                        last_name: 'Person',
                        email: 'fakep@ncsu.edu',
                        campus_id: '001136721',
                    },
                ],
            }),
        })
    })

    await page
        .locator('[test-id="add-admin-input"] input')
        .fill('fakep')

    await page
        .locator('text=John Champion (jtchampi@ncsu.edu) [200103374]')
        .click()



    // await page
    //     .locator('text=Luc Sanchez (lgsanche@ncsu.edu) [001136746]')
    //     .click()

    await page.locator('[test-id="add-admin-btn"]').click()

    await expect(page.locator('[test-id="admin-table"]')).toContainText(
        'jtchampi@ncsu.edu'
    )

    await page.unroute(/\/people\?search=lgsanche/)

})