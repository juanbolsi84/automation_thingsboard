import CommonActions from "../Utilities/CommonActions";

export default class Assets {
    constructor(page) {
        this.page = page;
        this.actions = new CommonActions(page, 'Name'); //The 'Name' parameter passes the column name for calling findRowByCellValue in CommonActions

    }

    get addAssetPlusBtn() { return this.page.locator('role=button >> text="add"') };
    get addAssetOption() { return this.page.locator('role=menuitem >> text="Add new asset"') };
    get dialogLocator() { return this.page.locator('role=dialog >> text="Add asset"') };
    get assetName() { return this.page.locator('role=textbox[name="Name"]') };
    get assetLabel() { return this.page.locator('role=textbox[name="Label"]') };
    get assetProfileLocator() { return this.page.locator('role=combobox[name="Asset profile"]') };
    get assignToCustomerLocator() { return this.page.locator('role=combobox[name="Assign to customer"]') };
    get assetDescription() { return this.page.locator('role=textbox[name="Description"]') };
    get addAssetBtn() { return this.page.locator('role=button[name="Add"]') };

    deleteAssetBtn(rowLocator) { return rowLocator.locator('button:has-text("delete")'); }
    get confirmDelete() { return this.page.locator('role=button[name="Yes"]') };
    get confirmDeleteDialog() { return this.page.locator('.cdk-overlay-container') };

    async createAsset({ name, label = '', assetProfile = 'default', assignToCustomer = '', description = '' }) {
        await this.actions.waitForTableToLoad();
        await this.actions.click(this.addAssetPlusBtn); // click + button
        await this.actions.click(this.addAssetOption); //click add new asset 
        await this.dialogLocator.waitFor({ state: 'visible' }); // wait for dialog to be visible
        await this.actions.click(this.assetName); // this makes the tests more stable as sometimes it fills too fast
        await this.actions.fill(this.assetName, name); //fill name        
        await this.actions.fill(this.assetLabel, label); //fill label        
        await this.actions.selectFromDropdown(this.assetProfileLocator, assetProfile); //fill assetProfile        
        if (assignToCustomer != '') {
            await this.actions.selectFromDropdown(this.assignToCustomerLocator, assignToCustomer)
        }
        await this.actions.fill(this.assetDescription, description); //fill description
        await this.actions.click(this.addAssetBtn); //click add button
        await this.addAssetBtn.waitFor({ state: 'hidden' });

    }

    async deleteAsset(name) {
        await this.actions.waitForTableToLoad();
        const rowLocator = await this.actions.findRowByCellValue(name);
        await this.deleteAssetBtn(rowLocator).click();
        await this.actions.click(this.confirmDelete);
        await this.confirmDelete.waitFor({ state: 'hidden' });

    }


}