import CommonActions from "../Utilities/CommonActions.js";

export default class HomePage {
    constructor(page) {
        this.page = page;
        this.actions = new CommonActions(page);

    }

    get devicesLink() {return this.page.locator('.mat-drawer a:has-text("Devices")')};
    get assetsLink() {return this.page.locator('.mat-drawer a:has-text("Assets")')};
    get clientsLink() {return this.page.locator('.mat-drawer a:has-text("Customers")')};
    get dashboardLink() {return this.page.locator('.mat-drawer a:has-text("Dashboards")')};
    get imageGalleryLink() {return this.page.locator('.mat-drawer a:has-text("Image Gallery")')};
    

    async goToDevices() {
        await this.actions.click(this.devicesLink);
    }

    async goToAssets() {
        await this.actions.click(this.assetsLink);
    }

    async goToCustomers() {
        await this.actions.click(this.clientsLink);
    }

    async goToDashboard(){
        await this.actions.click(this.dashboardLink);
    }

    async goToImageGallery(){
        await this.actions.click(this.imageGalleryLink);        
    }
}


