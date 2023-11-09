import { test, expect } from '@playwright/test'
import { LiaisonPermissionsPage } from '../../pages/LiaisonPermissionsPage'

test.skip('give a clearance but deny a liaison access to the tool', async ({
    page,
}) => {
    await page.route(/\/personnel\?search=jtchampi/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                personnel: [
                    {
                        first_name: 'Shawn',
                        middle_name: '',
                        last_name: 'Taylor',
                        email: 'staylor8@ncsu.edu',
                        campus_id: '001120834',
                    },
                ],
            }),
        })
    })

    await page.route(/\/role-accounts\?role=Liaison/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                accounts: [],
            }),
        })
    })

    await page.route(/\/update-account-roles/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                account: {
                    email: 'staylor8@ncsu.edu',
                    name: 'Shawn Taylor',
                    roles: ['Liaison'],
                },
            }),
        })
    })

    await page.locator('#TagInput-2').fill('staylor8')
    await page.getByText('Shawn Taylor (staylor8@ncsu.edu) [001120834]').click()

    await page.locator('#TagInput-4').fill('ClearanceA')
    await page.locator('//div[@id="TagInputAutocomplete-0-item-0"]').click()

    await page.locator('[test-id=assign-permission-btn]').click()

    await page
        .getByRole('button', { name: "Don't Grant Access", exact: true })
        .click()

    await expect(
        page.getByRole('heading', { name: 'Permissions Assigned' })
    ).toBeVisible()

    await page.locator('[test-id=revoke-permission-btn]').first().click()

    await expect(
        page.getByRole('heading', { name: 'Revoke Succeeded' })
    ).toBeVisible()

    const liaisonPermissionsPage = new LiaisonPermissionsPage(page)
    await liaisonPermissionsPage.goto()

    await liaisonPermissionsPage.routePersonnelRequest()
    await liaisonPermissionsPage.routeClearanceSearchRequest()
    await liaisonPermissionsPage.routeAssignmentRequest()
    await liaisonPermissionsPage.routeRoleAccountRequest()
    await liaisonPermissionsPage.routeUpdateRoleRequest()

    await liaisonPermissionsPage.searchForLiaison('fakep')
    // this will click on the search result that pops up in the search bar, matching the string after "text="
    await liaisonPermissionsPage.clickOnSearchResult('text=Fake Person (fakep@ncsu.edu) [000000000]')

    await liaisonPermissionsPage.searchForClearance('testc')
    await liaisonPermissionsPage.clickOnSearchResult('text=testclearance')

    await expect(liaisonPermissionsPage.permissionsAssignedHeader).toBeVisible()

    await liaisonPermissionsPage.revokeButton.click()

    await expect(liaisonPermissionsPage.revocationSucceededHeader).toBeVisible()

    await liaisonPermissionsPage.unroutePersonnelRequest()
    await liaisonPermissionsPage.unrouteClearanceSearchRequest()
    await liaisonPermissionsPage.unrouteAssignmentRequest()
    await liaisonPermissionsPage.unrouteRoleAccountRequest()
    await liaisonPermissionsPage.unrouteUpdateRoleRequest()
})