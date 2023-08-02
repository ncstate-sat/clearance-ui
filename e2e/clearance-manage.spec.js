import { test, expect } from '@playwright/test'
import path from 'path'

test.describe('[Admin] Assign & Manage Clearances page', () => {
  test.beforeEach(async ({ page }) => {
    const refreshToken = process.env['E2E_REFRESH_TOKEN']

    await page.addInitScript((rt) => {
      window.localStorage.setItem('refresh-token', rt)
    }, refreshToken)

    await page.goto('/manage')
  })

  test.skip('assign and revoke a clearance', async ({ page }) => {
    await page.locator('[test-id="personnel-input"] input').fill('jtchampi')
    await page
      .getByText('John Champion (jtchampi@ncsu.edu) [200103374]')
      .click()

    await page.locator('[test-id="clearance-input"] input').fill('ClearanceA')
    await page.locator('//div[@id="TagInputAutocomplete-0-item-0"]').click()

    await page.locator('[test-id=assign-clearance-btn]').click()

    await expect(
      page.getByRole('heading', { name: 'Clearance(s) Assigned Successfully' })
    ).toBeVisible()

    await page.locator('[test-id="revoke-clearance-btn"]').first().click()

    await expect(
      page.getByRole('heading', { name: 'Revoke Succeeded' })
    ).toBeVisible()
  })

  test.skip('handle an error assigning a clearance', async ({ page }) => {
    const ERROR_MESSAGE = '[TEST] Could not assign clearance.'

    await page.route(/\/assignments\/assign$/, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ detail: ERROR_MESSAGE }),
      })
    })

    await page.locator('[test-id="personnel-input"] input').fill('rsemmle')
    await page.getByText('Ryan Semmler (rsemmle@ncsu.edu) [001132807]').click()

    await page.locator('[test-id="clearance-input"] input').fill('ClearanceA')
    await page.locator('//div[@id="TagInputAutocomplete-0-item-0"]').click()

    await page.locator('[test-id=assign-clearance-btn]').click()

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

  test.skip('handle an error revoking a clearance assignment', async ({
    page,
  }) => {
    const ERROR_MESSAGE = '[TEST] Could not revoke clearance assignment.'

    await page.route(/\/assignments\/revoke$/, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ detail: ERROR_MESSAGE }),
      })
    })

    await page.locator('[test-id="personnel-input"] input').fill('rsemmle')
    await page.getByText('Ryan Semmler (rsemmle@ncsu.edu) [001132807]').click()

    await page.locator('[test-id="clearance-input"] input').fill('ClearanceA')
    await page.locator('//div[@id="TagInputAutocomplete-0-item-0"]').click()

    await page.locator('[test-id=assign-clearance-btn]').click()

    await expect(
      page.getByRole('heading', { name: 'Clearance(s) Assigned Successfully' })
    ).toBeVisible()

    await page.locator('[test-id="revoke-clearance-btn"]').first().click()

    const toastElement = await page.getByRole('heading', {
      name: ERROR_MESSAGE,
    })
    const color = await toastElement.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue('color')
    )
    expect(color).toBe('rgb(167, 54, 54)')

    await page.unroute(/\/assignments\/revoke$/)
  })

  test.skip('select persons with missing details', async ({ page }) => {
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

    await page.locator('[test-id="personnel-input"] input').fill('100015229')
    await page.getByText('Dunbar Driver #1 () [100015229]').click()

    await expect(
      page.getByText('Dunbar Driver #1 () [100015229]')
    ).toBeVisible()
  })

  test('select a clearance that contains commas', async ({ page }) => {
    await page.route(/\/assignments$/, async (route) => {
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

    await page.locator('[test-id="personnel-input"] input').fill('jtchampi')
    await page
      .getByText('John Champion (jtchampi@ncsu.edu) [200103374]')
      .click()

    await page.locator('[test-id="clearance-input"] input').fill('454')
    await page.locator('//div[@id="TagInputAutocomplete-0-item-0"]').click()

    await expect(
      page
        .getByRole('strong')
        .filter({ hasText: 'MRC-ECE 401/A 446 454 454D-DEPT' })
        .locator('svg')
    ).toBeVisible()
  })
})

test.describe('[Liaison] Assign & Manage Clearances page', () => {
  test.beforeEach(async ({ page }) => {
    const refreshToken = process.env['E2E_LIAISON_REFRESH_TOKEN']

    await page.addInitScript((rt) => {
      window.localStorage.setItem('refresh-token', rt)
    }, refreshToken)

    await page.goto('/manage')
  })

  test.skip('assign and revoke a clearance', async ({ page }) => {
    await page.locator('[test-id="personnel-input"] input').fill('staylor8')
    await page.getByText('Shawn Taylor (staylor8@ncsu.edu) [001120834]').click()

    await page.locator('[test-id="clearance-input"] input').fill('ClearanceA')
    await page.locator('//div[@id="TagInputAutocomplete-0-item-0"]').click()

    await page.locator('[test-id=assign-clearance-btn]').click()

    await expect(
      page.getByRole('heading', { name: 'Clearance(s) Assigned Successfully' })
    ).toBeVisible()

    await page
      .locator('button:not([disabled])[test-id="revoke-clearance-btn"]')
      .first()
      .click()

    await expect(
      page.getByRole('heading', { name: 'Revoke Succeeded' })
    ).toBeVisible()
  })

  test.skip('verify disabled revoke buttons appear disabled', async ({
    page,
  }) => {
    await page.locator('[test-id="personnel-input"] input').fill('staylor8')
    await page.getByText('Shawn Taylor (staylor8@ncsu.edu) [001120834]').click()

    await page.locator('[test-id="clearance-input"] input').fill('ClearanceA')
    await page.locator('//div[@id="TagInputAutocomplete-0-item-0"]').click()

    await page.locator('[test-id=assign-clearance-btn]').click()

    await expect(
      page.getByRole('heading', { name: 'Clearance(s) Assigned Successfully' })
    ).toBeVisible()

    const enabledButton = await page
      .locator('button:not([disabled])[test-id="revoke-clearance-btn"]')
      .first()
    const disabledButton = await page
      .locator('button[disabled][test-id="revoke-clearance-btn"]')
      .first()

    const enabledColor = await enabledButton.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue('color')
    )
    const disabledColor = await disabledButton.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue('color')
    )

    expect(enabledColor).toBe('rgb(204, 0, 0)')
    expect(disabledColor).toBe('rgb(204, 204, 204)')
  })

  test.skip('bulk upload a list of people', async ({ page }) => {
    await page.locator('[test-id="choose-csv-btn"]').first().click()

    const filePath = path.resolve('./e2e/bulk-upload-personnel-ids.csv')
    console.log(filePath)

    await page.getByTestId('file-upload').setInputFiles(filePath)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(4990)

    const selectedCount = await page.$$eval(
      '[test-id="file-upload"] strong',
      (elements) => elements.length
    )

    await expect(selectedCount).toBeGreaterThan(1)
  })
})
