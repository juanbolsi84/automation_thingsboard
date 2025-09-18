import { expect } from "playwright/test";
import CommonActions from "../Utilities/CommonActions.js";

export default class Devices {
    constructor(page) {
        this.actions = new CommonActions(page);
    }

    async createDevice({ name, label = '', profile = 'default', assignToCustomer = '' }) {
        await this.actions.click('role=button >> text=add');
        await this.actions.click('role=menuitem[name="Add new device"]');
        const nameField = this.actions.page.getByRole('textbox', { name: 'Name' });
        await nameField.waitFor({ state: 'visible' });
        await this.actions.click('role=textbox[name="Name"]');
        await this.actions.fill('role=textbox[name="Name"]', name);
        await this.actions.fill('role=textbox[name="Label"]', label);
        await this.actions.selectFromDropdown('role=combobox[name="Device profile"]', profile);
        await this.actions.selectFromDropdown('role=combobox[name="Assign to customer"]', assignToCustomer);
        await this.actions.click('role=button[name="Add"]');
        const closeButton = await this.actions.page.getByRole('button', { name : 'Close'});
        await this.actions.click('role=button[name="Close"]');
        await closeButton.waitFor({state: 'detached'});
    }


    async findRowByCellValue(columnName, valueToCheck) {
        // Find the row where a given column has a specific value
        const headersLocator = 'mat-header-cell';
        const rowsLocator = 'mat-row';

        // Get all header texts
        const headers = await this.actions.page.locator(headersLocator).allTextContents();
        const colIndex = headers.findIndex(h => h.trim() === columnName);

        if (colIndex === -1) throw new Error(`Column "${columnName}" not found`);

        // Get all rows
        const rows = this.actions.page.locator(rowsLocator);
        const rowCount = await rows.count();

        // Check each row for the value under the chosen header
        for (let i = 0; i < rowCount; i++) {
            const cellText = await rows.nth(i).locator('mat-cell').nth(colIndex).textContent();
            if (cellText?.trim() === valueToCheck) {
                return rows.nth(i); // return row locator
            }
        }

        return null; // not found
    }

    async deleteDevice(columnName, value) {
        // Find the row where the column has the given value
        const rowLocator = await this.findRowByCellValue(columnName, value);
        if (!rowLocator) throw new Error(`Device not found`);

        // Find the delete button inside that row
        const deleteBtn = rowLocator.locator('button:has-text("delete")');

        // Click the delete button
        await deleteBtn.click();

        // Confirm deletion in the dialog
        await this.actions.click('role=button[name="Yes"]');

    }

    async waitForRow(action, valueToCheck) {
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