import { test, expect } from '@playwright/test'
import { LiaisonPermissionsPage } from '../../pages/LiaisonPermissionsPage'

// // TODO: Remove John's info from E2E tests
// test('handle an error revoking a permission', async ({ page }) => {
//     const ERROR_MESSAGE = '[TEST] Could not give permission.'

//     await page.route(/\/personnel\?search=jtchampi/, async (route) => {
//       await route.fulfill({
//         status: 200,
//         contentType: 'application/json',
//         body: JSON.stringify({
//           personnel: [
//             {
//               first_name: 'Shawn',
//               middle_name: '',
//               last_name: 'Taylor',
//               email: 'staylor8@ncsu.edu',
//               campus_id: '001120834',
//             },
//           ],
//         }),
//       })
//     })

//     await page.route(/\/role-accounts\?role=Liaison/, async (route) => {
//       await route.fulfill({
//         status: 200,
//         contentType: 'application/json',
//         body: JSON.stringify({
//           accounts: [],
//         }),
//       })
//     })

//     await page.route(/\/update-account-roles/, async (route) => {
//       await route.fulfill({
//         status: 200,
//         contentType: 'application/json',
//         body: JSON.stringify({
//           account: {
//             email: 'staylor8@ncsu.edu',
//             name: 'Shawn Taylor',
//             roles: ['Liaison'],
//           },
//         }),
//       })
//     })

//     await page.route(/\/liaison\/revoke$/, async (route) => {
//       await route.fulfill({
//         status: 500,
//         contentType: 'application/json',
//         body: JSON.stringify({ detail: ERROR_MESSAGE }),
//       })
//     })

//     const liaisonPermissionsPage = new LiaisonPermissionsPage(page)
//     liaisonPermissionsPage.goto()

//     await page.locator('[test-id=personnel-input]').locator('input').fill('jtchampi')
//     await page.getByText('Shawn Taylor (staylor8@ncsu.edu) [001120834]').click()

//     await page.locator('[test-id=clearance-input]').locator('input').fill('ClearanceA')
//     await page.locator('//div[@id="TagInputAutocomplete-0-item-0"]').click()

//     await page.locator('[test-id=assign-permission-btn]').click()

//     await page
//       .getByRole('button', { name: 'Grant Access', exact: true })
//       .click()

//     await expect(
//       page.getByRole('heading', { name: 'Permissions Assigned' })
//     ).toBeVisible()

//     await page.locator('[test-id=revoke-permission-btn]').first().click()

//     await expect(
//       page.getByRole('heading', { name: ERROR_MESSAGE })
//     ).toBeVisible()

//     const toastElement = await page.getByRole('heading', {
//       name: ERROR_MESSAGE,
//     })
//     const color = await toastElement.evaluate((el) =>
//       window.getComputedStyle(el).getPropertyValue('color')
//     )
//     expect(color).toBe('rgb(167, 54, 54)')
//   })

// TODO: Remove John's info from E2E tests
test('view liaison permissions, add a permission, and remove a permission', async ({
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
          accounts: [
            {
              email: 'staylor8@ncsu.edu',
              name: 'Shawn Taylor',
              roles: ['Liaison'],
              authorizations: [],
            },
          ],
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
    liaisonPermissionsPage.goto()

    await page.locator('[test-id=personnel-input]').locator('input').fill('jtchampi')
    await page.getByText('Shawn Taylor (staylor8@ncsu.edu) [001120834]').click()

    await page.locator('[test-id=clearance-input] input').fill('ClearanceA')
    await page.locator('//div[@id="TagInputAutocomplete-0-item-0"]').click()

    await page.locator('[test-id=assign-permission-btn]').click()

    await expect(
      page.getByRole('heading', { name: 'Permissions Assigned' })
    ).toBeVisible()

    await page.locator('[test-id=revoke-permission-btn]').first().click()

    await expect(
      page.getByRole('heading', { name: 'Revoke Succeeded' })
    ).toBeVisible()
  })

  test('view liaison permissions, add a permission, remove a permission, and give the person the Liaison role', async ({
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

    const liaisonPermissionsPage = new LiaisonPermissionsPage(page)
    liaisonPermissionsPage.goto()

    await page.locator('[test-id=personnel-input]').locator('input').fill('staylor8')
    await page.getByText('Shawn Taylor (staylor8@ncsu.edu) [001120834]').click()

    await page.locator('[test-id=clearance-input] input').fill('ClearanceA')
    await page.locator('//div[@id="TagInputAutocomplete-0-item-0"]').click()

    await page.locator('[test-id=assign-permission-btn]').click()

    await page
      .getByRole('button', { name: 'Grant Access', exact: true })
      .click()

    await expect(
      page.getByRole('heading', { name: 'Permissions Assigned' })
    ).toBeVisible()

    await page.locator('[test-id=revoke-permission-btn]').first().click()

    await expect(
      page.getByRole('heading', { name: 'Revoke Succeeded' })
    ).toBeVisible()
  })

  test('view liaison permissions, add a permission, remove a permission, and do not give the person the Liaison role', async ({
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

    const liaisonPermissionsPage = new LiaisonPermissionsPage(page)
    liaisonPermissionsPage.goto()

    await page.locator('[test-id=personnel-input]').locator('input').fill('staylor8')
    await page.getByText('Shawn Taylor (staylor8@ncsu.edu) [001120834]').click()

    await page.locator('[test-id=clearance-input] input').fill('ClearanceA')
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
  })

  test('handle an error assigning a permission', async ({ page }) => {
    const ERROR_MESSAGE = '[TEST] Could not give permission.'

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

    await page.route(/\/liaison\/assign$/, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ detail: ERROR_MESSAGE }),
      })
    })

    const liaisonPermissionsPage = new LiaisonPermissionsPage(page)
    liaisonPermissionsPage.goto()

    await page.locator('[test-id=personnel-input]').locator('input').fill('staylor8')
    await page.getByText('Shawn Taylor (staylor8@ncsu.edu) [001120834]').click()

    await page.locator('[test-id=clearance-input] input').fill('ClearanceA')
    await page.locator('//div[@id="TagInputAutocomplete-0-item-0"]').click()

    await page.locator('[test-id=assign-permission-btn]').click()

    await page
      .getByRole('button', { name: 'Grant Access', exact: true })
      .click()

    await expect(
      page.getByRole('heading', { name: ERROR_MESSAGE })
    ).toBeVisible()

    const toastElement = await page.getByRole('heading', {
      name: ERROR_MESSAGE,
    })
    const color = await toastElement.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue('color')
    )
    expect(color).toBe('rgb(167, 54, 54)')
  })

  // TODO: Remove John's info from E2E tests
  test('handle an error revoking a permission', async ({ page }) => {
    const ERROR_MESSAGE = '[TEST] Could not give permission.'

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

    await page.route(/\/liaison\/revoke$/, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ detail: ERROR_MESSAGE }),
      })
    })

    const liaisonPermissionsPage = new LiaisonPermissionsPage(page)
    liaisonPermissionsPage.goto()

    await page.locator('[test-id=personnel-input]').locator('input').fill('staylor8')
    await page.getByText('Shawn Taylor (staylor8@ncsu.edu) [001120834]').click()

    await page.locator('[test-id=clearance-input] input').fill('ClearanceA')
    await page.locator('//div[@id="TagInputAutocomplete-0-item-0"]').click()

    await page.locator('[test-id=assign-permission-btn]').click()

    await page
      .getByRole('button', { name: 'Grant Access', exact: true })
      .click()

    await expect(
      page.getByRole('heading', { name: 'Permissions Assigned' })
    ).toBeVisible()

    await page.locator('[test-id=revoke-permission-btn]').first().click()

    await expect(
      page.getByRole('heading', { name: ERROR_MESSAGE })
    ).toBeVisible()

    const toastElement = await page.getByRole('heading', {
      name: ERROR_MESSAGE,
    })
    const color = await toastElement.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue('color')
    )
    expect(color).toBe('rgb(167, 54, 54)')
  })

  test('select persons with missing details', async ({ page }) => {
    const personnel = [
      {
        first_name: '',
        middle_name: '',
        last_name: 'Dunbar Driver #1',
        email: '',
        campus_id: '100015229',
      },
    ]

    await page.route(/\/personnel\?search=100015229/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ personnel: personnel }),
      })
    })

    const liaisonPermissionsPage = new LiaisonPermissionsPage(page)
    liaisonPermissionsPage.goto()

    await page.locator('[test-id="personnel-input"] input').fill('100015229')
    await page.getByText('Dunbar Driver #1 () [100015229]').click()

    await expect(
      page.getByText('Dunbar Driver #1 () [100015229]')
    ).toBeVisible()
  })