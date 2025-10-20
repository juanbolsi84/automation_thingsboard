import { expect } from "playwright/test";
import CommonActions from "../Utilities/CommonActions.js";

export default class Devices {
    constructor(page) {
        this.page = page;
        this.actions = new CommonActions(page, 'Name'); //The 'Name' parameter passes the column name for calling findRowByCellValue in CommonActions
    }

    // Getters for locators
    get addDevicePlusBtn() {return this.page.locator('role=button >> text=add')};
    get addDeviceOption() {return this.page.locator('role=menuitem[name="Add new device"]')};
    get dialogLocator() {return this.page.locator('role=dialog >> text="Add new device"')};
    get deviceName() {return this.page.locator('role=textbox[name="Name"]')};
    get deviceLabel() {return this.page.locator('role=textbox[name="Label"]')};
    get deviceProfileLocator() {return this.page.locator('role=combobox[name="Device profile"]')}; 
    get assignToCustomerLocator() {return this.page.locator('role=combobox[name="Assign to customer"]')};
    get deviceDescription() {return this.page.locator('role=textbox[name="Description"]')};
    get addDeviceBtn() {return this.page.locator('role=button[name="Add"]')};
    get closeButton() {return this.page.locator('role=button[name="Close"]')};

    get deleteDeviceBtn() {return this.page.locator('button:has-text("delete")')};
    get confirmDelete() {return this.page.locator('role=button[name="Yes"]')};
    get confirmDeleteDialog() {return this.page.locator('.cdk-overlay-container')};
    
    get nextButtonLocator() {return this.page.locator('role=button[name="Next page"]')};


    async createDevice({ name, label = '', profile = 'default', assignToCustomer = '', description = '' }) {
        await this.actions.waitForTableToLoad();
        await this.actions.click(this.addDevicePlusBtn);
        await this.actions.click(this.addDeviceOption);
        await this.dialogLocator.waitFor({state:'visible'});
        await this.actions.click(this.deviceName); // This click before filling the field makes tests stable. Without it, it may not fill the field reliably
        await this.actions.fill(this.deviceName, name);
        // Add an if statement to fill again if not properly filled on the first attempt
        await this.actions.fill(this.deviceLabel, label);
        await this.actions.selectFromDropdown(this.deviceProfileLocator, profile);
        if(assignToCustomer != ''){
        await this.actions.selectFromDropdown(this.assignToCustomerLocator, assignToCustomer);
        }
        await this.actions.fill(this.deviceDescription, description); 
        await this.actions.click(this.addDeviceBtn);
        await this.actions.click(this.closeButton);
        await this.closeButton.waitFor({state:'hidden'});

    }
    
    async deleteDevice(value) {
        await this.actions.waitForTableToLoad();
        // Find the row where the column has the given value
        const rowLocator = await this.actions.findRowByCellValue(value);
        if (!rowLocator) throw new Error(`Device not found`);

        // Find the delete button inside that row
        const deleteBtn = await rowLocator.locator(this.deleteDeviceBtn);

        // Click the delete button
        await deleteBtn.click();

        // Confirm deletion in the dialog
        await this.actions.click(this.confirmDelete);
        await this.confirmDelete.waitFor({state:'hidden'});
    }

    async clickNextButton(){
        await this.actions.click(this.nextButtonLocator);
    }

}