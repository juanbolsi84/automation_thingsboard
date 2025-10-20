import CommonActions from "../Utilities/CommonActions";

export default class ResetPw{
    constructor(page){
        this.page = page;
        this.actions = new CommonActions(page);
    }

    get forgotPWPageName() {return 'ThingsBoard | Request Password Reset'};
    get forgotPWUrl() {return `${process.env.TB_BASE_URL || 'http://localhost:8080'}/login/resetPasswordRequest`};
    get enterPassword() {return this.page.locator('role=textbox[name="Email"]')};
    get requestPWResetBtn() {return this.page.locator('role=button[name="Request Password Reset"]')};
    get cancelBtn() {return this.page.locator('role=button >> text=Cancel')};

    async requestPwReset(email){
        await this.actions.fill(this.enterPassword, email);
        await this.actions.click(this.requestPWResetBtn);
    }

    get confirmationMsg() {return this.page.locator('text=Reset link has been sent')};
    get confirmationClose() {return this.page.locator('role=button >> text=Close')};

    async closeConfirmationMsg(){
        await this.actions.click(this.confirmationClose);
    }

    async cancel(){
        await this.actions.click(this.cancelBtn);
    }


    get invalidEmailFormat() {return this.page.locator('text=Invalid email format.')};
}