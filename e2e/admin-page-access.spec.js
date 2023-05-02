import { test, expect } from '@playwright/test'

test.describe('Admin Access to Pages', () => {
  test.beforeEach(async ({ page }) => {
    const refreshToken = process.env['E2E_REFRESH_TOKEN']

    await page.addInitScript((rt) => {
      window.localStorage.setItem('refresh-token', rt)
    }, refreshToken)
  })

  test('it should be able to access the `manage` page as an admin', async ({
    page,
  }) => {
    await page.goto('/manage')

    const url = page.url()
    const pathname = url.match(/https?:\/\/[^\/]+(.*)/)[1]
    expect(pathname).toEqual('/manage')
  })

  test('it should be able to access the `audit` page as an admin', async ({
    page,
  }) => {
    await page.goto('/audit')

    const url = page.url()
    const pathname = url.match(/https?:\/\/[^\/]+(.*)/)[1]
    expect(pathname).toEqual('/audit')
  })

  test('it should be able to access the `liaison-permissions` page as an admin', async ({
    page,
  }) => {
    await page.goto('/liaison-permissions')

    const url = page.url()
    const pathname = url.match(/https?:\/\/[^\/]+(.*)/)[1]
    expect(pathname).toEqual('/liaison-permissions')
  })

  test('it should be able to access the `admin` page as an admin', async ({
    page,
  }) => {
    await page.goto('/admin')

    const url = page.url()
    const pathname = url.match(/https?:\/\/[^\/]+(.*)/)[1]
    expect(pathname).toEqual('/admin')
  })
})
