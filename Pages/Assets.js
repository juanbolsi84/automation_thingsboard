import CommonActions from "../Utilities/CommonActions";

export default class Assets {
    constructor(page) {
        this.actions = new CommonActions(page);

        // Selectors
        this.addAssetPlusBtn = 'role=button >> text="add"';
        this.addAssetOption = 'role=menuitem >> text="Add new asset"';
        this.dialogLocator = 'role=dialog >> text="Add asset"';
        this.assetName = 'role=textbox[name="Name"]';
        this.assetLabel = 'role=textbox[name="Label"]';
        this.assetProfileLocator = 'role=combobox[name="Asset profile"]';
        this.assignToCustomerLocator = 'role=combobox[name="Assign to customer"]';
        this.assetDescription = 'role=textbox[name="Description"]';
        this.addAssetBtn = 'role=button[name="Add"]';

    }

    async createAsset({ name, label = '', assetProfile = 'default', assignToCustomer = '', description = '' }) {

        await this.actions.click(this.addAssetPlusBtn); // click + button
        await this.actions.click(this.addAssetOption); //click add new asset

        const dialogLocator = this.actions.page.locator(this.dialogLocator); // wait for dialog to be visible
        await dialogLocator.waitFor({ state: 'visible' });

        await this.actions.fill(this.assetName, name); //fill name        
        await this.actions.fill(this.assetLabel, label); //fill label        
        //await this.actions.selectFromDropdown(this.assetProfileLocator, assetProfile); //fill assetProfile        
        
        if (assignToCustomer != '') { 
            await this.actions.selectFromDropdown(this.assignToCustomerLocator, assignToCustomer)
        }

        await this.actions.fill(this.assetDescription, description); //fill description
        await this.actions.click(this.addAssetBtn); //click add button

    }

    async findRowByCellValue(columnName, valueToCheck) {

        const headersLocator = 'mat-header-cell';
        const rowsLocator = 'mat-row';

        const headers = await this.actions.page.locator(headersLocator).allTextContents();
        const colIndex = headers.findIndex(h => h.trim() === columnName);

        const rows = await this.actions.page.locator(rowsLocator);
        const rowCount = rows.count();

        for (let i = 0; i < rowCount; i++) {
            const cellText = await rows.nth(i).locator('mat-cell').nth(colIndex).textContent();
            if (cellText == valueToCheck) {
                return rows.nth(i);
            }
        }

        return null;
    }

    async deleteAsset(columnName, name) {
        const rowLocator = await this.findRowByCellValue(columnName, name);
        const deleteBtn = await rowLocator.locator('button:has-text("delete")')
        await deleteBtn.click();
        await this.actions.click('role=button[name="Yes"]');

    }

    async waitForRow(action, valueToCheck) {
        for (let i = 0; i <= 10; i++) {
            const row = await this.findRowByCellValue('Name', valueToCheck);
            if (action === 'created' && row) {
                return true;
            } else if (action === 'deleted' && !row) {
                return true;
            }
            await this.actions.page.waitForTimeout(1000);
        }
    }


}