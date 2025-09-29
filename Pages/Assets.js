import CommonActions from "../Utilities/CommonActions";

export default class Assets {
    constructor(page) {
        this.actions = new CommonActions(page);

        // Selectors for createAsset
        this.addAssetPlusBtn = 'role=button >> text="add"';
        this.addAssetOption = 'role=menuitem >> text="Add new asset"';
        this.dialogLocator = 'role=dialog >> text="Add asset"';
        this.assetName = 'role=textbox[name="Name"]';
        this.assetLabel = 'role=textbox[name="Label"]';
        this.assetProfileLocator = 'role=combobox[name="Asset profile"]';
        this.assignToCustomerLocator = 'role=combobox[name="Assign to customer"]';
        this.assetDescription = 'role=textbox[name="Description"]';
        this.addAssetBtn = 'role=button[name="Add"]';

        // Selector for deleteAsset
        this.deleteAssetBtn = 'button:has-text("delete")';
        this.confirmDelete = 'role=button[name="Yes"]';
        this.confirmDeleteDialog = '.cdk-overlay-container';


    }

    async createAsset({ name, label = '', assetProfile = 'default', assignToCustomer = '', description = '' }) {

        await this.actions.click(this.addAssetPlusBtn); // click + button
        await this.actions.click(this.addAssetOption); //click add new asset
        const dialogLocator = this.actions.page.locator(this.dialogLocator); // wait for dialog to be visible
        await dialogLocator.waitFor({ state: 'visible' });
        await this.actions.click(this.assetName); // this makes the tests more stable as sometimes it fills too fast
        await this.actions.fill(this.assetName, name); //fill name        
        await this.actions.fill(this.assetLabel, label); //fill label        
        await this.actions.selectFromDropdown(this.assetProfileLocator, assetProfile); //fill assetProfile        
        if (assignToCustomer != '') { 
            await this.actions.selectFromDropdown(this.assignToCustomerLocator, assignToCustomer)
        }
        await this.actions.fill(this.assetDescription, description); //fill description
        await this.actions.click(this.addAssetBtn); //click add button
        await this.actions.page.locator(this.dialogLocator).waitFor({state:'hidden'});

    }

    async deleteAsset(columnName, name) {
        const rowLocator = await this.actions.findRowByCellValue(columnName, name);
        const deleteBtn = await rowLocator.locator(this.deleteAssetBtn);
        await deleteBtn.click();
        await this.actions.click(this.confirmDelete);
        await this.actions.page.locator(this.confirmDeleteDialog).waitFor({state:'hidden'});

    }


}