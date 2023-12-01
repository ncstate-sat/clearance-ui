import { test, expect } from '@playwright/test'
import { LiaisonPermissionsPage } from '../../pages/LiaisonPermissionsPage'

test.skip('copy permissions from one liaison to another', async ({
    page,
}) => {
    await page.route(/\/personnel\?search=lmena/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                personnel: [
                    {
                        first_name: 'Lisa',
                        middle_name: '',
                        last_name: 'Mena',
                        email: 'lmena@test.edu',
                        campus_id: '001132808',
                    },
                ],
            }),
        })
    })

    await page.route(/\/personnel\?search=rsemmle/, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                personnel: [
                    {
                        first_name: 'Ryan',
                        middle_name: '',
                        last_name: 'Semmler',
                        email: 'rsemmle8@test.edu',
                        campus_id: '001132807',
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
    await liaisonPermissionsPage.searchForCopyLiaison('copyfakep')
    await liaisonPermissionsPage.clickOnSearchResult('text=Copy Fake (cake@test.edu) [000000001]')
    await expect(LiaisonPermissionsPage.assignedClearanceSuccessToast).toBeVisible()
})