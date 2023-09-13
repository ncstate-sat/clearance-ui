import { test, expect } from '@playwright/test'

test.describe('Liaison Access to Pages', () => {
  test.beforeEach(async ({ page }) => {
    const refreshToken = process.env['E2E_LIAISON_REFRESH_TOKEN']

    await page.addInitScript((rt) => {
      window.localStorage.setItem('refresh-token', rt)
    }, refreshToken)
  })

  test.skip('it should be able to access the `manage` page as a liaison', async ({
    page,
  }) => {
    await page.goto('/manage')

    const url = page.url()
    const pathname = url.match(/https?:\/\/[^\/]+(.*)/)[1]
    expect(pathname).toEqual('/manage')
  })

  test.skip('it should not be able to access the `audit` page as a liaison', async ({
    page,
  }) => {
    await page.goto('/audit')
    //Wait for the redirection, from '/audit' to 'manage, to finish before conducting the testing.
    setTimeout(() => {
      const url = page.url()
      const pathname = url.match(/https?:\/\/[^\/]+(.*)/)[1]
      expect(pathname).toEqual('/manage')
    }, 2000)
  })

  test.skip('it should not be able to access the `liaison-permissions` page as a liaison', async ({
    page,
  }) => {
    await page.goto('/liaison-permissions')
    //Wait for the redirection, from '/audit' to 'manage, to finish before conducting the testing.
    setTimeout(() => {
      const url = page.url()
      const pathname = url.match(/https?:\/\/[^\/]+(.*)/)[1]
      expect(pathname).toEqual('/manage')
    }, 2000)
  })

  test.skip('it should not be able to access the `admin` page as a liaison', async ({
    page,
  }) => {
    await page.goto('/admin')
    //Wait for the redirection, from '/audit' to 'manage, to finish before conducting the testing.
    setTimeout(() => {
      const url = page.url()
      const pathname = url.match(/https?:\/\/[^\/]+(.*)/)[1]
      expect(pathname).toEqual('/manage')
    }, 2000)
  })
})
