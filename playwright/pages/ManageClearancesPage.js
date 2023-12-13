import path from 'path'

export class ManageClearancesPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page
    // reusable elements on the page
    this.pageHeader = this.page.getByRole('heading', {
      name: 'Assign & Manage Clearances',
    })
    this.personInput = this.page.getByRole('textbox')
    this.clearanceInput = this.page
      .locator('div')
      .filter({ hasText: /^Select ClearanceNo Clearances Found$/ })
      .getByRole('textbox')
    this.assignClearanceButton = this.page.getByRole('button', {
      name: 'Assign',
    })
    this.assignFutureClearanceButton = this.page.getByRole('button', {
      name: 'Assign Future',
    })
    this.splitButtonDropdown = this.page.locator('.caret-button')
    this.assignFutureOption = this.page.getByText('Assign Future')
    this.startDateNode = this.page.locator('.sc-dtBdUo').first()
    this.startDateTextbox = this.page.getByRole('textbox').nth(2)
    this.assignedClearanceSuccessToast = this.page.getByRole('heading', {
      name: 'Clearance(s) Assigned Successfully',
    })
    this.clearancesTable = this.page.getByTestId('clearances-table')
    this.revokeSuccessToast = this.page.getByRole('heading', {
      name: 'Revoke Succeeded',
    })
    // this will find all revoke buttons, so only use when there is just 1 clearance present
    this.revokeButton = this.page.getByTestId('revoke-clearance-btn')
    this.assignedClearanceFailureToast = this.page.getByRole('heading', {
      name: '[TEST] Could not assign clearance.',
    })
    this.revokeFailureToast = this.page.getByRole('heading', {
      name: '[TEST] Could not revoke clearance assignment.',
    })
    this.mockedPersonnelEntry = this.page.getByText('Missing [100015229]')
    this.mockedClearanceEntry = this.page.getByText(
      'MRC-ECE 401/A, 446, 454, 454D-DEPT'
    )
    this.chooseCSVButton = this.page.getByTestId('choose-csv-btn')
    this.fileUpload = this.page.getByTestId('file-upload')
    this.bulkUploadTable = this.page.getByTestId('bulk-upload-table')
    this.helpButton = this.page.getByTestId('help-button-main')
    this.tipsButton = this.page.getByTestId('tips-button-main')
    this.ackModal = this.page.getByRole('button', { name: 'Acknowledge' })
    this.suggestionBoxBackdrop = this.page.getByTestId(
      'suggestion-box-backdrop'
    )
  }

  async goto() {
    await this.page.goto('/manage')
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

  async routeClearanceSearchRequestWithCommas() {
    await this.page.route(/\/clearances\?search=MRC/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          clearance_names: [
            {
              id: 8360,
              name: 'MRC-ECE 401/A, 446, 454, 454D-DEPT',
            },
          ],
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
          assignees: '000000000',
          clearance_ids: 2239,
        }),
      })
    })
  }

  async routeRevocationRequest() {
    await this.page.route(/\/assignments\/revoke$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        // TODO currently the body of this response isnt really doing anything
        body: JSON.stringify({
          detail: '[TEST] Could not revoke clearance assignment.',
        }),
      })
    })
  }

  async routeUnseenAckRequest() {
    await this.page.route(
      /\/liaison\/needs-acknowledgement$/,
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            needs_acknowledgement: true,
          }),
        })
      }
    )
  }

  async routeSeenAckRequest() {
    await this.page.route(
      /\/liaison\/needs-acknowledgement$/,
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            needs_acknowledgement: false,
          }),
        })
      }
    )
  }

  async routeHelpRequest() {
    await this.page.route(/\/help\/create-ticket$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'A new help ticket has been created.',
        }),
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

  async unrouteClearanceSearchRequestWithCommas() {
    await this.page.unroute(/\/clearances\?search=MRC/)
  }

  async unrouteAssignmentRequest() {
    await this.page.unroute(/\/assignments\/assign$/)
  }

  async unrouteRevocationRequest() {
    await this.page.unroute(/\/assignments\/revoke$/)
  }

  async unrouteAckRequest() {
    await this.page.unroute(/\/liaison\/needs-acknowledgement$/)
  }

  async unrouteHelpRequest() {
    await this.page.unroute(/\/help\/create-ticket$/)
  }

  /**
   * @param {string} text
   */
  async searchForPerson(text) {
    await this.personInput.fill(text)
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

  async uploadPersonnelCSV() {
    const filePath = path.resolve(
      'playwright/data/bulk-upload-personnel-ids.csv'
    )
    await this.fileUpload.setInputFiles(filePath)
  }
}
