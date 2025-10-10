import CommonActions from "../Utilities/CommonActions.js";

export default class HomePage {
    constructor(page) {
        this.actions = new CommonActions(page);

    }

    get devicesLink() {return '[id="docs-menu-entity.entities"] >> role=link[name="Devices"]'};
    get assetsLink() {return 'role=link[name="Assets"]'};
    get clientsLink() {return 'role=link[name="Customers"]'};

    async goToDevices() {
        await this.actions.click(this.devicesLink);

    }

    async goToAssets() {
        await this.actions.click(this.assetsLink);
    }

    async goToCustomers() {
        await this.actions.click(this.clientsLink)
    }
}


