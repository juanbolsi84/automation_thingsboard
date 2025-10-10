import CommonActions from "../Utilities/CommonActions.js";

export default class Customers {
    constructor(page){
        this.page = page;
        this.actions = new CommonActions(page, 'Title'); // The 'Title' parameter passes the column name for calling findRowByCellValue in CommonActions
    }

    get addCustomerBtn() {return 'role=button >> text=add'};
    get customerName() {return 'role=textbox[name="Title"]'};
    get customerDescription() {return 'role=textbox[name="Description"]'};
    get countryName() {return 'mat-dialog-container input[type="text"][formcontrolname="country"]'};
    get city() {return 'role=textbox[name="City"]'};
    get state_province() {return 'role=textbox[name="State / Province"]'};
    get zip_postalCode() {return 'role=textbox[name="Zip / Postal Code"]'};
    get address1() {return 'role=textbox[name="Address"]'};
    get address2() {return 'role=textbox[name="Address 2"]'};
    get countryPhone() {return 'mat-dialog-container mat-select[formcontrolname="country"]'};
    get phone() {return 'role=textbox[name="Phone"]'};
    get email() {return 'role=textbox[name="Email"]'};
    get addBtn() {return 'role=button[name="Add"]'};


    async createCustomer(data){
        await this.actions.click(this.addCustomerBtn);
        await this.actions.fill(this.customerName, data.Title);
        await this.actions.fill(this.customerDescription, data.Description);
        await this.actions.selectFromDropdown(this.countryName, data.Country);
        await this.actions.fill(this.city, data.City);
        await this.actions.fill(this.state_province, data['State-Province']);
        await this.actions.fill(this.zip_postalCode, data['ZIP-Postal Code']);
        await this.actions.fill(this.address1, data.Address);
        await this.actions.fill(this.address2, data['Address 2']);
        await this.actions.selectFromDropdown(this.countryPhone, data.Country);
        await this.actions.fill(this.phone, data.Phone);
        await this.actions.fill(this.email, data.Email);
        await this.actions.click(this.addBtn);

    }

    async deleteCustomer(){

    }
}