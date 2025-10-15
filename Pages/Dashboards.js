import CommonActions from "../Utilities/CommonActions";

export default class Dashboards{
    constructor(page){
        this.page = page;
        this.actions = new CommonActions(page, 'Title');
    }

    get addBtn() {return 'role=button >> text=add'};
    get createNewDashboardOpt() {return 'role=menuitem[name="Create new dashboard"]'};
    get dialogLocator () {return 'role=dialog >> text="Add dashboard"'};
    get dashboardTitle () {return 'role=textbox[name="Title"]'};
    get description() {return 'role=textbox[name="Description"]'};
    get assignedCustomersCombo() {return 'role=combobox[name="Assigned customers"]'};
    get browseGallery() {return 'role=button[name="Browse from gallery"]'};
    get systemImagesSwitch() {return 'role=switch[name="Include system images"]'};
    get imageList() {return '.tb-image-preview-overlay'};
    get searchImages() {return 'role=button >> text=search'};
    get searchBar() {return 'input[placeholder="Search image"]'};
    get selectBtn() {return 'role=button >> text=Select'};
    get addDashboardBtn() {return 'role=button[name="Add"]'};


    async createDashboard(dashboard){
        await this.actions.click(this.addBtn);
        await this.actions.click(this.createNewDashboardOpt);
        await this.actions.page.locator(this.dialogLocator).waitFor({state:'visible'});
        await this.actions.fill(this.dashboardTitle, dashboard.title);
        await this.actions.fill(this.description, dashboard.description);
        await this.actions.selectFromMultiDropdown(this.assignedCustomersCombo, dashboard.customer);
        await this.actions.page.keyboard.press('Tab'); // This is a bit weird but we have to focus outside the dropdown to close it
        await this.actions.click(this.browseGallery);
        await this.actions.waitUntilEnabled(this.systemImagesSwitch);
        await this.actions.click(this.systemImagesSwitch);
        await this.actions.page.locator(this.imageList).nth(0).waitFor({ state: 'visible' }); // Waits until at least one element is displayed
        await this.actions.page.click(this.searchImages);
        await this.actions.fill(this.searchBar, dashboard.imageName);
        await this.actions.click(this.selectBtn);
        await this.actions.waitUntilEnabled(this.addDashboardBtn);
        await this.actions.click(this.addDashboardBtn);

    }

    get addNewWidgetBtn() {return 'role=button[name="Add new widget"]'};
    widgetBundleSelect(dashboard) {
        return `.widget-title[title="${dashboard.widgetBundle}"]`;
    }
    widgetSelect(dashboard){
        return `.widget-title[title="${dashboard.widget}"]`;
    }
    get deviceSelect() {return 'role=combobox[name="Device"]'};
    get addWidgetBtn() {return 'role=button[name="Add"]'};
    get addSave() {return 'role=button[name="Save"]'};
    get widgetClass() {return '.tb-widget'};


    

    async addWidget(dashboard){
        await this.actions.click(this.addNewWidgetBtn);
        await this.actions.page.locator(this.widgetBundleSelect(dashboard)).waitFor({state: 'visible'});
        await this.actions.click(this.widgetBundleSelect(dashboard));
        await this.actions.click(this.widgetSelect(dashboard));
        await this.actions.selectFromDropdown(this.deviceSelect, dashboard.device);
        await this.actions.click(this.addWidgetBtn);
        await this.actions.click(this.addSave);

    }

    async deleteDashboard(dashboard){
        await this.actions.findRowByCellValue(dashboard.title);
    }
}