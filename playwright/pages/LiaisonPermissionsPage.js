export class LiaisonPermissionsPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page
        // reusable elements on the page
        this.pageHeader = this.page.getByRole('heading', { name: 'Liaison Permissions' })
        this.liaisonInput = this.page.locator('[test-id="personnel-input"] input')
        this.clearanceInput = this.page.locator('[test-id="clearance-input"] input')
        this.givePermissionButton = this.page.getByTestId('test-id=assign-permission-btn')
        this.permissionsAssignedHeader = this.page.getByRole('heading', { name: 'Permissions Assigned' })
        // this will find all revoke buttons, so only use when there is just 1 clearance present
        this.revokeButton = this.page.getByTestId('revoke-permission-btn')
        this.revocationSucceededHeader = this.page.getByRole('heading', { name: 'Revoke Succeeded' })
        this.mockedLiaisonEntry = this.page.getByText('Missing () [100015229]')
    }

    async goto() {
        await this.page.goto('/liaison-permissions')
    }

    async routePersonnelRequest() {
        await this.page.route(/\/personnel\?search=fakep/, async (route) => {
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
                            campus_id: '000000000',
                        },
                    ],
                }),
            })
        })
    }

    async routePersonnelRequestWithMissingDetails() {
        await this.page.route(/\/personnel\?search=Missing/, async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    personnel: [
                        {
                            first_name: '',
                            middle_name: '',
                            last_name: 'Missing',
                            email: '',
                            campus_id: '100015229',
                        },
                    ],
                }),
            })
        })
    }

    async routeClearanceSearchRequest() {
        await this.page.route(/\/clearances\?search=testc/, async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    clearance_names: [
                        {
                            id: 2239,
                            name: 'testclearance',
                        },
                    ],
                }),
            })
        })
    }

    async routeRoleAccountRequest() {
        await this.page.route(/\/role-accounts\?role=Liaison/, async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              accounts: [],
            }),
          })
        })
    }

    async routeUpdateRoleRequest() {
        await this.page.route(/\/update-account-roles/, async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              account: {
                email: 'fakep@ncsu.edu',
                name: 'Fake Person',
                roles: ['Liaison'],
              },
            }),
          })
        })
    }

    async routeAssignmentRequest() {
        await this.page.route(/\/assignments\/assign$/, async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    assignees: "000000000",
                    clearance_ids: 2239
                }),
            })
        })
    }

    async routeRevocationRequest() {
        await this.page.route(/\/assignments\/revoke$/, async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ detail: '[TEST] Could not revoke clearance assignment.' }),
            })
        })
    }

    async unroutePersonnelRequest() {
        await this.page.unroute(/\/personnel\?search=fakep/)
    }

    async unroutePersonnelRequestWithMissingDetails() {
        await this.page.unroute(/\/personnel\?search=Missing/)
    }

    async unrouteClearanceSearchRequest() {
        await this.page.unroute(/\/clearances\?search=testc/)
    }

    async unrouteRoleAccountRequest() {
        await this.page.unroute(/\/role-accounts\?role=Liaison/)
    }

    async unrouteUpdateRoleRequest() {
        await this.page.unroute(/\/update-account-roles/)
    }

    async unrouteAssignmentRequest() {
        await this.page.unroute(/\/assignments\/assign$/)
    }

    async unrouteRevocationRequest() {
        await this.page.unroute(/\/assignments\/revoke$/)
    }

    /**
     * @param {string} text
     */
    async searchForLiaison(text) {
        await this.liaisonInput.fill(text)
    }

    /**
     * @param {string} text
     */
    async searchForClearance(text) {
        await this.clearanceInput.fill(text)
    }

    /**
     * @param {string} selectorString
     */
    async clickOnSearchResult(selectorString) {
        await this.page.locator(selectorString).click()
    }
}