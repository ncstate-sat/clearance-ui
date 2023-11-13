import { test, expect } from '@playwright/test'
import { LiaisonPermissionsPage } from '../../pages/LiaisonPermissionsPage'

test.skip('handle an error assigning a permission', async ({ page }) => {
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

  await page.locator('#TagInput-2').fill('staylor8')
  await page.getByText('Shawn Taylor (staylor8@ncsu.edu) [001120834]').click()

  await page.locator('#TagInput-4').fill('ClearanceA')
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
test.skip('handle an error revoking a permission', async ({ page }) => {
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

  await page.locator('#TagInput-2').fill('staylor8')
  await page.getByText('Shawn Taylor (staylor8@ncsu.edu) [001120834]').click()

  await page.locator('#TagInput-4').fill('ClearanceA')
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