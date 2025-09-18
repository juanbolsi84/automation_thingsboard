import CommonActions from "../Utilities/CommonActions";

export default class Assets {
    constructor(page) {
        this.actions = new CommonActions(page);
    }

    async createAsset({ name, label = '', assetProfile = 'default', assignToCustomer = '', description = '' }) {   
        // click + button
        await this.actions.click('role=button >> text="add"');
        //click add new asset
        await this.actions.click('role=menuitem >> text="Add new asset"');

        // wait for dialog to be visible
        const dialogLocator = this.actions.page.locator('role=dialog >> text="Add asset"');
        await dialogLocator.waitFor({ state: 'visible' });

        //fill name
        await this.actions.fill('role=textbox[name="Name"]',name);

        //fill label
        await this.actions.fill('role=textbox[name="Label"]',label);

        //fill assetProfile
        await this.actions.selectFromDropdown('role=combobox[name="Asset profile"]', assetProfile);

        //fill assign to customer
        await this.actions.selectFromDropdown('role=combobox[name="Assign to customer"]', assignToCustomer);

        //fill description
        await this.actions.fill('role=textbox[name="Description"]', description);

        //click add button
        await this.actions.click('role=button[name="Add"]');

    }

    async findRowByCellValue(columnName, valueToCheck){
        
        const headersLocator = 'mat-header-cell'; 
        const rowsLocator = 'mat-row';

        const headers = await this.actions.page.locator(headersLocator).allTextContents();
        const colIndex = headers.findIndex(h => h.trim() === columnName);

        const rows = await this.actions.page.locator(rowsLocator);
        const rowCount = rows.count();

        for(let i=0; i < rowCount; i++){
            const cellText = await rows.nth(i).locator('mat-cell').nth(colIndex).textContent();
            if(cellText == valueToCheck){
                return rows.nth(i);
            }            
        }

        return null;
    } 

    async deleteAsset(columnName, name){
        const rowLocator = await this.findRowByCellValue(columnName, name);
        const deleteBtn = await rowLocator.locator('button:has-text("delete")')
        await deleteBtn.click();
        await this.actions.click('role=button[name="Yes"]');

    }

    async waitForRow(action, valueToCheck){
        for(let i=0; i <= 10; i++){
            const row = await this.findRowByCellValue('Name', valueToCheck);
            if(action === 'created' && row){                
                return true;
            } else if(action === 'deleted' && !row) {                
                return true;
            }
            await this.actions.page.waitForTimeout(1000);
        }
    }


}