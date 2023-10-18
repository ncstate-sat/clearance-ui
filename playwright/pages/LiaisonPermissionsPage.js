import { expect } from '@playwright/test'

export class LiaisonPermissionsPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page
        // reusable elements on the page
    }

    async goto() {
        await this.page.goto('/liaison-permissions')
        // Wait for all data to have loaded
        await this.page.waitForLoadState('networkidle')
        // const rowsBefore = await this.tableEntries.count()
        // expect(rowsBefore).toBeGreaterThan(0)
    }
}