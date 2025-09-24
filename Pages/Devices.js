import { expect } from "playwright/test";
import CommonActions from "../Utilities/CommonActions.js";

export default class Devices {
    constructor(page) {
        this.actions = new CommonActions(page);

        // Selectors for createDevice
        this.addDevicePlusBtn = 'role=button >> text=add';
        this.addDeviceOption = 'role=menuitem[name="Add new device"]';
        this.dialogLocator = 'role=dialog >> text="Add new device"';
        this.deviceName = 'role=textbox[name="Name"]';
        this.deviceLabel = 'role=textbox[name="Label"]';
        this.deviceProfileLocator = 'role=combobox[name="Device profile"]';
        this.assignToCustomerLocator = 'role=combobox[name="Assign to customer"]';
        this.deviceDescription ='role=textbox[name="Description"]';
        this.addDeviceBtn = 'role=button[name="Add"]';
        this.closeButton = 'role=button[name="Close"]';

        // Selector for deleteAsset
        this.deleteDeviceBtn = 'button:has-text("delete")';
        this.confirmDelete = 'role=button[name="Yes"]';


    }

    async createDevice({ name, label = '', profile = 'default', assignToCustomer = '', description = '' }) {
        await this.actions.click(this.addDevicePlusBtn);
        await this.actions.click(this.addDeviceOption);
        const dialogLocator = this.actions.page.locator(this.dialogLocator);
        await dialogLocator.waitFor({state:'visible'});
        await this.actions.page.locator(this.deviceName).click(); // This click before filling the field makes tests more reliable. Without it, it may not fill the field reliably
        await this.actions.fill(this.deviceName, name);
        await this.actions.fill(this.deviceLabel, label);
        await this.actions.selectFromDropdown(this.deviceProfileLocator, profile);
        if(assignToCustomer != ''){
        await this.actions.selectFromDropdown(this.assignToCustomerLocator, assignToCustomer);
        }
        await this.actions.fill(this.deviceDescription, description); 
        await this.actions.click(this.addDeviceBtn);
        await this.actions.click(this.closeButton);
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

    }

    



}