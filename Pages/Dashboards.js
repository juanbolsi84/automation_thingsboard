import CommonActions from "../Utilities/CommonActions";

export default class Dashboards {
    constructor(page){
        this.page = page;
        this.actions = new CommonActions(page, 'Title');
    }

    // --- Locators ---
    get addBtn() { return this.page.locator('role=button >> text=add'); }
    get createNewDashboardOpt() { return this.page.locator('role=menuitem[name="Create new dashboard"]'); }
    get dialogLocator() { return this.page.locator('role=dialog >> text="Add dashboard"'); }
    get dashboardTitle() { return this.page.locator('role=textbox[name="Title"]'); }
    get description() { return this.page.locator('role=textbox[name="Description"]'); }
    get assignedCustomersCombo() { return this.page.locator('role=combobox[name="Assigned customers"]'); }
    get browseGallery() { return this.page.locator('role=button[name="Browse from gallery"]'); }
    get systemImagesSwitch() { return this.page.locator('role=switch[name="Include system images"]'); }
    get imageList() { return this.page.locator('.tb-image-preview-overlay'); }
    get searchImages() { return this.page.locator('role=button >> text=search'); }
    get searchBar() { return this.page.locator('input[placeholder="Search image"]'); }
    get selectBtn() { return this.page.locator('role=button >> text=Select'); }
    get addDashboardBtn() { return this.page.locator('role=button[name="Add"]'); }

    async createDashboard(dashboard){
        await this.actions.click(this.addBtn);
        await this.actions.click(this.createNewDashboardOpt);
        await this.dashboardTitle.waitFor({state:'visible'});
        await this.actions.fill(this.dashboardTitle, dashboard.title);
        await this.actions.fill(this.description, dashboard.description);
        await this.actions.selectFromMultiDropdown(this.assignedCustomersCombo, dashboard.customer);
        await this.page.keyboard.press('Tab'); // focus outside dropdown to close it
        await this.actions.click(this.browseGallery);
        await this.actions.waitUntilEnabled(this.systemImagesSwitch);
        await this.actions.click(this.systemImagesSwitch);
        await this.imageList.nth(0).waitFor({ state: 'visible' });
        await this.actions.click(this.searchImages);
        await this.actions.fill(this.searchBar, dashboard.imageName);
        await this.selectBtn.nth(0).waitFor({ state: 'visible' }); // first button visible
        await this.selectBtn.nth(1).waitFor({ state: 'hidden' });  // second button hidden
        await this.actions.click(this.selectBtn.nth(0)); // makes sure it clicks on the first instance, just in case        
        await this.actions.waitUntilEnabled(this.addDashboardBtn);
        await this.actions.click(this.addDashboardBtn);
    }

    // --- Widgets ---
    get addNewWidgetBtn() { return this.page.locator('role=button[name="Add new widget"]'); }
    widgetBundleSelect(dashboard) { return this.page.locator(`.widget-title[title="${dashboard.widgetBundle}"]`); }
    widgetSelect(dashboard) { return this.page.locator(`.widget-title[title="${dashboard.widget}"]`); }
    get deviceSelect() { return this.page.locator('role=combobox[name="Device"]'); }
    get addWidgetBtn() { return this.page.locator('role=button[name="Add"]'); }
    get addSave() { return this.page.locator('role=button[name="Save"]'); }
    get widgetClass() { return this.page.locator('.tb-widget'); }
    get downloadButton() { return this.page.locator('role=button >> text=file_download'); }

    async addWidget(dashboard){
        await this.actions.click(this.addNewWidgetBtn);
        await this.widgetBundleSelect(dashboard).waitFor({state: 'visible'});
        await this.actions.click(this.widgetBundleSelect(dashboard));
        await this.actions.click(this.widgetSelect(dashboard));
        await this.actions.selectFromDropdown(this.deviceSelect, dashboard.device);
        await this.actions.click(this.addWidgetBtn);
        await this.actions.click(this.addSave);
        await this.actions.waitUntilEnabled(this.downloadButton);
    }

    // --- Delete ---
    get deleteDashboardBtn() { return this.page.locator('button:has-text("delete")'); }
    get confirmDelete() { return this.page.locator('role=button[name="Yes"]'); }
    get confirmDeleteDialog() { return this.page.locator('.cdk-overlay-container'); }

    async deleteDashboard(dashboard){
        const rowLocator = await this.actions.findRowByCellValue(dashboard.title);
        if (!rowLocator) throw new Error(`Dashboard not found`);

        const deleteBtn = await rowLocator.locator(this.deleteDashboardBtn);
        await deleteBtn.click();

        await this.actions.click(this.confirmDelete);
        await this.confirmDelete.waitFor({state:'hidden'});
    }
}
