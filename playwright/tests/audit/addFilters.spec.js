import { test, expect } from '@playwright/test'
import { AuditLogPage } from '../../pages/AuditLogPage'

test('add and clear filters', async ({ page }) => {
    const auditLogPage = new AuditLogPage(page)
    await auditLogPage.goto()

    await auditLogPage.addFilterButton.click()

    // add all filters
    await auditLogPage.personFilter.click()
    await expect(auditLogPage.personFilterHeader).toBeVisible()
    await auditLogPage.assignerFilter.click()
    await expect(auditLogPage.assignerFilterHeader).toBeVisible()
    await auditLogPage.clearanceFilter.click()
    await expect(auditLogPage.clearanceFilterHeader).toBeVisible()
    await auditLogPage.dateFilter.click()
    await expect(auditLogPage.dateFilterHeader).toBeVisible()

    // clear filters with clear filters button
    await auditLogPage.clearFilter.click()
    await expect(auditLogPage.personFilterHeader).not.toBeVisible()
    await expect(auditLogPage.assignerFilterHeader).not.toBeVisible()
    await expect(auditLogPage.clearanceFilterHeader).not.toBeVisible()
    await expect(auditLogPage.dateFilterHeader).not.toBeVisible()

    // add filters and clear them with x button
    await auditLogPage.addFilterButton.click()
    await auditLogPage.personFilter.click()
    await auditLogPage.addFilterButton.click()
    await auditLogPage.filterXButton.click()
    await expect(auditLogPage.personFilterHeader).not.toBeVisible()

    await auditLogPage.addFilterButton.click()
    await auditLogPage.assignerFilter.click()
    await auditLogPage.addFilterButton.click()
    await auditLogPage.filterXButton.click()
    await expect(auditLogPage.assignerFilterHeader).not.toBeVisible()
    
    await auditLogPage.addFilterButton.click()
    await auditLogPage.clearanceFilter.click()
    await auditLogPage.addFilterButton.click()
    await auditLogPage.filterXButton.click()
    await expect(auditLogPage.clearanceFilterHeader).not.toBeVisible()
    
    await auditLogPage.addFilterButton.click()
    await auditLogPage.dateFilter.click()
    await auditLogPage.addFilterButton.click()
    await auditLogPage.filterXButton.click()
    await expect(auditLogPage.dateFilterHeader).not.toBeVisible()
})