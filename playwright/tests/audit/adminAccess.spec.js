import { test, expect } from '@playwright/test'
import { AuditLogPage } from '../../pages/AuditLogPage'

test('access the `audit` page as an admin', async ({ page }) => {
    const auditLogPage = new AuditLogPage(page)
    await auditLogPage.goto()
    await expect(page).toHaveURL(/.*audit/)

    await expect(auditLogPage.pageHeader).toContainText('Audit Log')
})