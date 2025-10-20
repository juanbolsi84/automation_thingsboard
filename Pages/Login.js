import CommonActions from "../Utilities/CommonActions.js";

export default class LoginPage {
    constructor(page) {
        this.page = page;
        this.actions = new CommonActions(page);
    }

    async navigate() {
        await this.actions.navigate(process.env.TB_BASE_URL || 'http://localhost:8080/');
    }

    get username() { return this.page.locator('#username-input') };
    get password() { return this.page.locator('#password-input') };
    get loginBtn() { return this.page.locator('button:has-text("Login")') };
    get url() {return `${process.env.TB_BASE_URL || 'http://localhost:8080'}/login`};  


    async login(username, password) {
        await this.actions.fill(this.username, username);
        await this.actions.fill(this.password, password);
        await this.actions.click(this.loginBtn);

    }

    get invalidMsg() { return this.page.locator('text="Invalid username or password"') };

    get closeInvalidMsgBtn() { return this.page.locator('role=button >> text=Close') };

    async closeInvalidMsg() {
        await this.actions.click(this.closeInvalidMsgBtn);
    }

    get invalidEmailFormat() { return this.page.locator('text=Invalid email format.') };

    get visiblePwBtn() { return this.page.locator('tb-toggle-password >> button') };

    async togglePasswordVisibility() {
        await this.actions.click(this.visiblePwBtn);
    }

    get forgotPW() {return this.page.locator('role=button >> text=Forgot Password?')};

    async clickForgotPW(){
        await this.actions.click(this.forgotPW);
    }

}