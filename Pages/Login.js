import CommonActions from "../Utilities/CommonActions.js";

export default class LoginPage{
    constructor(page){
        this.actions = new CommonActions(page);
    }

    async navigate(){
        await this.actions.navigate(process.env.TB_BASE_URL || 'http://localhost:8080/');
    }

    async login(username, password){
        await this.actions.fill('#username-input', username);
        await this.actions.fill('#password-input', password);
        await this.actions.click('button:has-text("Login")');
        
    }
}