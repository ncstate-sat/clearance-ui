export class ReportsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page
    // reusable elements on the page
    this.pageHeader = this.page.getByRole('heading', { name: 'Reports' })
    this.downloadLiaisonAssignmentsButton = this.page.getByTestId(
      'liaison-assignments-download-btn'
    )
    this.peopleClearancesButton = this.page.getByTestId('people-clearances')
    this.doorClearancesButton = this.page.getByTestId('door-clearances')
    this.transactionsButton = this.page.getByTestId('transactions')
    this.mockedClearanceEntry = this.page.getByText(
      'VRB-SAT All Doors MOD1-DEPT'
    )
    this.mockedTransactionEntry = this.page.getByText('Ashley Noelle Simpson')
  }

  async goto() {
    await this.page.goto('/reports')
  }

  async getHeading(text) {
    return await this.page.getByRole('heading', {
      name: text,
    })
  }

  async routePeopleClearancesRequest() {
    await this.page.route(
      /\/reports\/clearances\/persons\?clearances_limit=\d+&clearances_skip=\d+/,
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            total_clearances: 4,
            clearances: {
              ClearanceB: {
                clearance_id: 10354,
                assignee_count: 3,
                assignees: [
                  {
                    first: 'Ryan',
                    last: 'Semmler',
                    campus_id: '001132807',
                    department: 0,
                    status: '',
                  },
                  {
                    first: 'Lisa',
                    last: 'Mena',
                    campus_id: '001132808',
                    department: 0,
                    status: '',
                  },
                  {
                    first: 'Lisa',
                    last: 'Gordon',
                    campus_id: '000007405',
                    department: 111101,
                    status: 'RET',
                  },
                ],
              },
              ClearanceC: {
                clearance_id: 10355,
                assignee_count: 3,
                assignees: [
                  {
                    first: 'John',
                    last: 'Champion',
                    campus_id: '200103374',
                    department: 0,
                    status: '',
                  },
                  {
                    first: 'Kem',
                    last: 'Smith',
                    campus_id: '000104711',
                    department: 0,
                    status: '',
                  },
                  {
                    first: 'Bobby',
                    last: 'Smith',
                    campus_id: '000339387',
                    department: 443401,
                    status: 'SPA',
                  },
                ],
              },
              'VRB-SAT All Doors MOD1-DEPT': {
                clearance_id: 9069,
                assignee_count: 0,
                assignees: [],
              },
              'VRB - HS - Test': {
                clearance_id: 9497,
                assignee_count: 1,
                assignees: [
                  {
                    first: 'Ryan',
                    last: 'Semmler',
                    campus_id: '001132807',
                    department: 0,
                    status: '',
                  },
                ],
              },
            },
          }),
        })
      }
    )
  }

  async routePeopleClearancesRequestError() {
    await this.page.route(
      /\/reports\/clearances\/persons\?clearances_limit=\d+&clearances_skip=\d+/,
      async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            detail: '[TEST] Could not do the thing.',
          }),
        })
      }
    )
  }

  async routeDoorClearancesRequest() {
    await this.page.route(
      /\/reports\/clearances\/doors\?clearances_limit=\d+&clearances_skip=\d+/,
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            total_clearances: 4,
            clearances: {
              ClearanceB: {
                clearance_id: 10354,
                door_count: 3,
                doors: [
                  {
                    name: 'TSU - 1100 South Corridor 1150',
                    is_elevator: false,
                    schedule_name: 'Always',
                  },
                  {
                    name: 'TSU - 4221 Copy and Supply Room',
                    is_elevator: false,
                    schedule_name: 'Always',
                  },
                  {
                    name: 'TSU - Elevator Car Two (2)',
                    is_elevator: true,
                    schedule_name: 'TSU- 6a-1a Access',
                  },
                ],
              },
              ClearanceC: {
                clearance_id: 10355,
                door_count: 3,
                doors: [
                  {
                    name: 'TSU - 1100 South Corridor 1150',
                    is_elevator: false,
                    schedule_name: 'Always',
                  },
                  {
                    name: 'TSU - 4221 Copy and Supply Room',
                    is_elevator: false,
                    schedule_name: 'Always',
                  },
                  {
                    name: 'TSU - Elevator Car Two (2)',
                    is_elevator: true,
                    schedule_name: 'TSU- 6a-1a Access',
                  },
                ],
              },
              'VRB-SAT All Doors MOD1-DEPT': {
                clearance_id: 9069,
                assignee_count: 0,
                doors: [],
              },
              'VRB - HS - Test': {
                clearance_id: 9497,
                door_count: 1,
                doors: [
                  {
                    name: 'TSU - 1100 South Corridor 1150',
                    is_elevator: false,
                    schedule_name: 'Always',
                  },
                ],
              },
            },
          }),
        })
      }
    )
  }

  async routeFilteredDoorClearancesRequest() {
    await this.page.route(
      /\/reports\/clearances\/doors\?clearances_limit=\d+&clearances_skip=\d+&door_ids=5000/,
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            total_clearances: 4,
            clearances: {
              ClearanceB: {
                clearance_id: 10354,
                door_count: 3,
                doors: [
                  {
                    name: 'TSU - 1100 South Corridor 1150',
                    is_elevator: false,
                    schedule_name: 'Always',
                  },
                  {
                    name: 'TSU - 4221 Copy and Supply Room',
                    is_elevator: false,
                    schedule_name: 'Always',
                  },
                  {
                    name: 'TSU - Elevator Car Two (2)',
                    is_elevator: true,
                    schedule_name: 'TSU- 6a-1a Access',
                  },
                ],
              },
            },
          }),
        })
      }
    )
  }

  async routeDoorClearancesRequestError() {
    await this.page.route(
      /\/reports\/clearances\/doors\?clearances_limit=\d+&clearances_skip=\d+/,
      async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            detail: '[TEST] Could not do the thing.',
          }),
        })
      }
    )
  }

  async routeTransactionsRequest() {
    await this.page.route(/\/reports\/usage\/transactions/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            date: new Date('9/13/22 4:59 PM'),
            door_name: 'EB1 - 3058 Lab',
            name: 'Ashley Noelle Simpson',
            campus_id: '200293592',
            state_code: 'Admit',
          },
          {
            date: new Date('9/13/22 4:36 PM'),
            door_name: 'EB1 - 3058 Lab',
            name: 'Joseph B. Tracy',
            campus_id: '0004056039',
            state_code: 'Admit',
          },
          {
            date: new Date('9/13/22 4:59 PM'),
            door_name: 'EB1 - 3058 Lab',
            name: null,
            campus_id: null,
            state_code: 'DoorForced',
          },
        ]),
      })
    })
  }

  async routeTransactionsRequestError() {
    await this.page.route(/\/reports\/usage\/transactions/, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          detail: '[TEST] Could not do the thing.',
        }),
      })
    })
  }

  async unroutePeopleClearancesRequest() {
    await this.page.unroute(
      /\/reports\/clearances\/persons\?clearances_limit=\d+&clearances_skip=\d+/
    )
  }

  async unrouteDoorClearancesRequest() {
    await this.page.unroute(
      /\/reports\/clearances\/doors\?clearances_limit=\d+&clearances_skip=\d+/
    )
  }

  async unrouteFilteredDoorClearancesRequest() {
    await this.page.unroute(
      /\/reports\/clearances\/doors\?clearances_limit=\d+&clearances_skip=\d+&door_ids=5000/
    )
  }

  async unrouteTransactionsRequest() {
    await this.page.unroute(/\/reports\/usage\/transactions/)
  }
}
