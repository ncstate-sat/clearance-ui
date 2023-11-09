import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  const refreshToken = process.env['E2E_REFRESH_TOKEN']
  await page.addInitScript((rt) => {
    window.localStorage.setItem('refresh-token', rt)
  }, refreshToken)

  await page.goto('/manage')
  // Wait for all data to have loaded
  await page.waitForLoadState('networkidle')

  await page.context().storageState({ path: authFile })
})