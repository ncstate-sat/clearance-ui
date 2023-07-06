import { test, expect } from '@playwright/test'

test.describe('Help Buttons', () => {
  test.beforeEach(async ({ page }) => {
    const refreshToken = process.env['E2E_REFRESH_TOKEN']

    await page.addInitScript((rt) => {
      window.localStorage.setItem('refresh-token', rt)
    }, refreshToken)
  })

  test.skip('click the global help button', async ({ page, context }) => {
    await page.goto('/manage')

    await page.locator('[test-id=help-button-main]').click()
    await page.waitForTimeout(2000)
    let pages = await context.pages()
    expect(pages.length).toBeGreaterThan(1)

    if (pages.length > 1) {
      const newPageURL = pages[1].url()
      expect(newPageURL.includes('github.ncsu.edu')).toBe(true)
    }
  })

  test.skip('click the Assign & Manage page help button', async ({
    page,
    context,
  }) => {
    await page.goto('/manage')

    await page.locator('[test-id=help-button-page]').click()
    await page.waitForTimeout(2000)
    let pages = await context.pages()
    expect(pages.length).toBeGreaterThan(1)

    if (pages.length > 1) {
      const newPageURL = pages[1].url()
      expect(newPageURL.includes('github.ncsu.edu')).toBe(true)
    }
  })

  test.skip('click the Liaison Permissions page help button', async ({
    page,
    context,
  }) => {
    await page.goto('/liaison-permissions')

    await page.locator('[test-id=help-button-page]').click()
    await page.waitForTimeout(2000)
    let pages = await context.pages()
    expect(pages.length).toBeGreaterThan(1)

    if (pages.length > 1) {
      const newPageURL = pages[1].url()
      expect(newPageURL.includes('github.ncsu.edu')).toBe(true)
    }
  })

  test.skip('click the Audit Log page help button', async ({
    page,
    context,
  }) => {
    await page.goto('/audit-log')

    await page.locator('[test-id=help-button-page]').click()
    await page.waitForTimeout(2000)
    let pages = await context.pages()
    expect(pages.length).toBeGreaterThan(1)

    if (pages.length > 1) {
      const newPageURL = pages[1].url()
      expect(newPageURL.includes('github.ncsu.edu')).toBe(true)
    }
  })

  test.skip('click the Admin page help button', async ({ page, context }) => {
    await page.goto('/admin')

    await page.locator('[test-id=help-button-page]').click()
    await page.waitForTimeout(2000)
    let pages = await context.pages()
    expect(pages.length).toBeGreaterThan(1)

    if (pages.length > 1) {
      const newPageURL = pages[1].url()
      expect(newPageURL.includes('github.ncsu.edu')).toBe(true)
    }
  })
})
