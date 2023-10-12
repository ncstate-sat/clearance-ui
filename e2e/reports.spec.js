import { test, expect } from '@playwright/test'

test.describe('Reports Page', () => {
  test.beforeEach(async ({ page }) => {
    const refreshToken = process.env['E2E_REFRESH_TOKEN']

    await page.addInitScript((rt) => {
      window.localStorage.setItem('refresh-token', rt)
    }, refreshToken)
  })

  test('it should download the liaison assignments report when the button is clicked', async ({
    page,
  }) => {
    await page.goto('/reports')

    await page.locator('[test-id=liaison-assignments-download-btn]').click()

    await page.waitForEvent('download')
  })

  test('it should view the person report', async ({ page }) => {
    await page.route(
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

    await page.goto('/reports')
    await page.getByTestId('people-clearances').click()
    await page.waitForTimeout(500)

    // Ensure a few items appear on the screen
    await expect(page.getByText('VRB-SAT All Doors MOD1-DEPT')).toBeVisible()
    await expect(page.getByText('ClearanceC')).toBeVisible()

    await page.unroute(
      /\/reports\/clearances\/persons\?clearances_limit=\d+&clearances_skip=\d+/
    )
  })

  test('it should view the door report', async ({ page }) => {
    await page.route(
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

    await page.goto('/reports')
    await page.getByTestId('door-clearances').click()
    await page.waitForTimeout(500)

    // Ensure a few items appear on the screen
    await expect(page.getByText('VRB-SAT All Doors MOD1-DEPT')).toBeVisible()
    await expect(page.getByText('ClearanceC')).toBeVisible()

    await page.unroute(
      /\/reports\/clearances\/doors\?clearances_limit=\d+&clearances_skip=\d+/
    )
  })

  test('it should view the transaction report', async ({ page }) => {
    await page.route(/\/reports\/usage\/transactions/, async (route) => {
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

    await page.goto('/reports')
    await page.getByTestId('transactions').click()
    await page.waitForTimeout(500)

    // Ensure a few items appear on the screen
    await expect(page.getByText('Ashley Noelle Simpson')).toBeVisible()
    await expect(page.getByText('Joseph B. Tracy')).toBeVisible()

    await page.unroute(/\/reports\/usage\/transactions/)
  })
})
