import CommonActions from "../Utilities/CommonActions.js";

export default class LoginPage{
    constructor(page){
        this.actions = new CommonActions(page);
    }

    async navigate(){
        await this.actions.navigate(process.env.TB_BASE_URL || 'http://localhost:8080/');
    }

    get username() {return '#username-input'};
    get password() {return '#password-input'};
    get loginBtn() {return 'button:has-text("Login")'};
    get passwordLocator() {return this.actions.page.locator(this.password)}

    async login(username, password){
        await this.actions.fill(this.username, username);
        await this.actions.fill(this.password, password);
        await this.actions.click(this.loginBtn);
        
    }

    get invalidMsg() {return 'text="Invalid username or password"'};

    getInvalidCredAlert(){
        return this.actions.page.locator(this.invalidMsg);
        
    }

    get closeInvalidMsgBtn() {return 'role=button >> text=Close'};

    async closeInvalidMsg(){
        await this.actions.click(this.closeInvalidMsgBtn);
    }

    get invalidEmailFormat() {return 'text=Invalid email format.'};

    invalidEmailMsg(){
        return this.actions.page.locator(this.invalidEmailFormat);
    }

    get visiblePwBtn() {return 'tb-toggle-password >> button'};

    async togglePasswordVisibility(){
        await this.actions.click(this.visiblePwBtn);
    }



}