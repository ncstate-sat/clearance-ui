export class AuditLogPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page
        // reusable elements on the page
        this.pageHeader = this.page.getByRole('heading', { name: 'Audit Log' })
        this.addFilterButton = this.page.getByRole('button', { name: 'Add Filter' })
        this.personAssignedToFilter = this.page.getByRole('menuitem', { name: 'Filter on Assigned To' })
        this.personDoneByFilter = this.page.getByRole('menuitem', { name: 'Filter on Done By' })
        this.clearanceFilter = this.page.getByRole('menuitem', { name: 'Filter by Clearance Name' })
        this.dateFilter = this.page.getByRole('menuitem', { name: 'Filter on Date Assigned' })
        this.clearFilter = this.page.getByRole('menuitem', { name: 'Clear Filters' })
        this.personAssignedToFilterHeader = this.page.getByRole('heading', { name: 'Select Person - Assigned To' })
        this.personDoneByFilterHeader = this.page.getByRole('heading', { name: 'Select Person - Done By' })
        this.clearanceFilterHeader = this.page.getByRole('heading', { name: 'Select Clearance' })
        this.dateFilterHeader = this.page.getByRole('heading', { name: 'Select Date Assigned' })
        // this will find all X buttons, so only use when there is just 1 filter present
        this.filterXButton = this.page.getByTestId('remove-filter-btn')
    }

    async goto() {
        await this.page.goto('/audit')
    }
}