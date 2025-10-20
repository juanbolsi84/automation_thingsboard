import CommonActions from "../Utilities/CommonActions.js";

export default class Customers {
    constructor(page){
        this.page = page;
        this.actions = new CommonActions(page, 'Title'); // The 'Title' parameter passes the column name for calling findRowByCellValue in CommonActions
    }

    get addCustomerBtn() {return this.page.locator('role=button >> text=add')};
    get dialogLocator() {return this.page.locator('role=dialog >> text="Add customer"')};
    get customerName() {return this.page.locator('role=textbox[name="Title"]')};
    get customerDescription() {return this.page.locator('role=textbox[name="Description"]')};
    get countryName() {return this.page.locator('mat-dialog-container input[type="text"][formcontrolname="country"]')};
    get city() {return this.page.locator('role=textbox[name="City"]')};
    get state_province() {return this.page.locator('role=textbox[name="State / Province"]')};
    get zip_postalCode() {return this.page.locator('role=textbox[name="Zip / Postal Code"]')};
    get address1() {return this.page.locator('role=textbox[name="Address"]')};
    get address2() {return this.page.locator('role=textbox[name="Address 2"]')};
    get countryPhone() {return this.page.locator('mat-dialog-container mat-select[formcontrolname="country"]')};
    get phone() {return this.page.locator('role=textbox[name="Phone"]')};
    get email() {return this.page.locator('role=textbox[name="Email"]')};
    get addBtn() {return this.page.locator('role=button[name="Add"]')};


    async createCustomer(data){
        await this.actions.click(this.addCustomerBtn);
        await this.dialogLocator.waitFor({state:'visible'});
        await this.actions.fill(this.customerName, data.Title);
        await this.actions.fill(this.customerDescription, data.Description);
        await this.actions.selectFromDropdown(this.countryName, data.Country);
        await this.actions.fill(this.city, data.City);
        await this.actions.fill(this.state_province, data['State-Province']);
        await this.actions.fill(this.zip_postalCode, data['ZIP-Postal Code']);
        await this.actions.fill(this.address1, data.Address);
        await this.actions.fill(this.address2, data['Address 2']);
        await this.actions.selectFromDropdown(this.countryPhone, data.Country);
        await this.actions.click(this.phone);
        await this.phone.type(data.Phone);
        await this.actions.fill(this.email, data.Email);
        await this.actions.click(this.addBtn);

    }

    deleteCustomerBtn(rowLocator) {return rowLocator.locator('role=button[name="delete"]')};
    get confirmDelete() {return this.page.locator('role=button[name="Yes"]')};

    async deleteCustomer(customer){
        await this.actions.waitForTableToLoad();
        const rowLocator = await this.actions.findRowByCellValue(customer);
        await this.deleteCustomerBtn(rowLocator).click();
        await this.actions.click(this.confirmDelete);
        await this.confirmDelete.waitFor({ state: 'hidden' });

    }

}