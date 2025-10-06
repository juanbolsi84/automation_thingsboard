import { expect } from "playwright/test";
import CommonActions from "../Utilities/CommonActions.js";

export default class Devices {
    constructor(page) {
        this.actions = new CommonActions(page);
    }

    // Getters for locators
    get addDevicePlusBtn() {return 'role=button >> text=add'};
    get addDeviceOption() {return 'role=menuitem[name="Add new device"]'};
    get dialogLocator() {return 'role=dialog >> text="Add new device"'};
    get deviceName() {return 'role=textbox[name="Name"]'};
    get deviceLabel() {return 'role=textbox[name="Label"]'};
    get deviceProfileLocator() {return 'role=combobox[name="Device profile"]'}; 
    get assignToCustomerLocator() {return 'role=combobox[name="Assign to customer"]'};
    get deviceDescription() {return 'role=textbox[name="Description"]'};
    get addDeviceBtn() {return 'role=button[name="Add"]'};
    get closeButton() {return 'role=button[name="Close"]'};

    get deleteDeviceBtn() {return 'button:has-text("delete")'};
    get confirmDelete() {return 'role=button[name="yes]'};
    get confirmDeleteDialog() {return '.cdk-overlay-container'};
    
    get nextButtonLocator() {return 'role=button[name="Next page"]'};


    async createDevice({ name, label = '', profile = 'default', assignToCustomer = '', description = '' }) {
        await this.actions.click(this.addDevicePlusBtn);
        await this.actions.click(this.addDeviceOption);
        const dialogLocator = this.actions.page.locator(this.dialogLocator);
        await dialogLocator.waitFor({state:'visible'});
        await this.actions.page.locator(this.deviceName).click(); // This click before filling the field makes tests stable. Without it, it may not fill the field reliably
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
        await this.actions.page.locator(this.dialogLocator).waitFor({state:'hidden'});

    }
    
    async deleteDevice(columnName, value) {
        // Find the row where the column has the given value
        const rowLocator = await this.actions.findRowByCellValue(columnName, value);
        if (!rowLocator) throw new Error(`Device not found`);

        // Find the delete button inside that row
        const deleteBtn = rowLocator.locator(this.deleteDeviceBtn);

        // Click the delete button
        await deleteBtn.click();

        // Confirm deletion in the dialog
        await this.actions.click(this.confirmDelete);
        await this.actions.page.locator(this.confirmDeleteDialog).waitFor({state:'hidden'});
    }

    async clickNextButton(){
        await this.actions.page.locator(this.nextButtonLocator).click();
    }

}