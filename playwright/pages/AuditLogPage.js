export class AuditLogPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page
        // reusable elements on the page
        this.pageHeader = this.page.getByRole('heading', { name: 'Audit Log' })
        this.addFilterButton = this.page.getByRole('button', { name: 'Add Filter' })
        this.personFilter = this.page.getByRole('menuitem', { name: 'Filter by Person' })
        this.assignerFilter = this.page.getByRole('menuitem', { name: 'Filter by Assigner' })
        this.clearanceFilter = this.page.getByRole('menuitem', { name: 'Filter by Clearance Name' })
        this.dateFilter = this.page.getByRole('menuitem', { name: 'Filter by Time' })
        this.clearFilter = this.page.getByRole('menuitem', { name: 'Clear Filters' })
        this.personFilterHeader = this.page.getByRole('heading', { name: 'Select Person' })
        this.assignerFilterHeader = this.page.getByRole('heading', { name: 'Select Assigner' })
        this.clearanceFilterHeader = this.page.getByRole('heading', { name: 'Select Clearance' })
        this.dateFilterHeader = this.page.getByRole('heading', { name: 'Search Timeframe' })
        // this will find all X buttons, so only use when there is just 1 filter present
        this.filterXButton = this.page.getByTestId('remove-filter-btn')
    }

    async goto() {
        await this.page.goto('/audit')
    }
}