export class ReportsPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page
        // reusable elements on the page
        this.pageHeader = this.page.getByRole('heading', { name: 'Reports' })
    }

    async goto() {
        await this.page.goto('/reports')
    }
}