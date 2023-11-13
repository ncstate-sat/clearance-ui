export class AdminPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page
    // reusable elements on the page
    this.adminPersonInput = this.page.locator('input[type="text"]')
    this.addAdminButton = this.page.getByTestId('add-admin-btn')
    this.addLiaisonButton = this.page.getByTestId('add-liaison-btn')
    this.adminTable = this.page.getByTestId('admin-table')
    this.liaisonTable = this.page.getByTestId('liaison-table')
    // uses the automation email that was used to authenticate into the app
    this.userRevokeButton = this.page.locator(
      '[test-id="sat.admin.svc@ncsu.edu"] button'
    )
    this.pageHeader = this.page.getByRole('heading', { name: 'Manage Users' })
  }

  async goto() {
    await this.page.goto('/admin')
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

  async unroutePersonnelRequest() {
    await this.page.unroute(/\/people\?search=fakep/)
  }

  /**
   * @param {string} text
   */
  async searchForPerson(text) {
    await this.adminPersonInput.fill(text)
  }

  /**
   * @param {string} selectorString
   */
  async clickOnPerson(selectorString) {
    await this.page.locator(selectorString).click()
  }
}
