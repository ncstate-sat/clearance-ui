import { test, expect } from '@playwright/test'
import { AuditLogPage } from '../../pages/AuditLogPage'

test('add and clear filters', async ({ page }) => {
    const auditLogPage = new AuditLogPage(page)
    await auditLogPage.goto()

    await auditLogPage.addFilterButton.click()

    // add all filters
    await auditLogPage.personAssignedToFilter.click()
    await expect(auditLogPage.personAssignedToFilterHeader).toBeVisible()
    await auditLogPage.personDoneByFilter.click()
    await expect(auditLogPage.personDoneByFilterHeader).toBeVisible()
    await auditLogPage.clearanceFilter.click()
    await expect(auditLogPage.clearanceFilterHeader).toBeVisible()
    await auditLogPage.dateFilter.click()
    await expect(auditLogPage.dateFilterHeader).toBeVisible()

    // clear filters with clear filters button
    await auditLogPage.clearFilter.click()
    await expect(auditLogPage.personAssignedToFilterHeader).not.toBeVisible()
    await expect(auditLogPage.personDoneByFilterHeader).not.toBeVisible()
    await expect(auditLogPage.clearanceFilterHeader).not.toBeVisible()
    await expect(auditLogPage.dateFilterHeader).not.toBeVisible()

    // add filters and clear them with x button
    await auditLogPage.addFilterButton.click()
    await auditLogPage.personAssignedToFilter.click()
    await auditLogPage.addFilterButton.click()
    await auditLogPage.filterXButton.click()
    await expect(auditLogPage.personAssignedToFilterHeader).not.toBeVisible()

    await auditLogPage.addFilterButton.click()
    await auditLogPage.personDoneByFilter.click()
    await auditLogPage.addFilterButton.click()
    await auditLogPage.filterXButton.click()
    await expect(auditLogPage.personDoneByFilterHeader).not.toBeVisible()
    
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