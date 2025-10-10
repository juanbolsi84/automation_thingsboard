import CommonActions from "../Utilities/CommonActions";

export default class Dashboards{
    constructor(page){
        this.page = page;
        this.actions = new CommonActions(page, 'Title');
    }

    //create new dashboard
}