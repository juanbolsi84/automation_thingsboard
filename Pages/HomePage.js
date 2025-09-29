import CommonActions from "../Utilities/CommonActions.js";

export default class HomePage {
    constructor(page) {
        this.actions = new CommonActions(page);

    }

    async goToDevices() {
        await this.actions.click('[id="docs-menu-entity.entities"] >> role=link[name="Devices"]');

    }

    async goToAssets() {
        await this.actions.click('role=link[name="Assets"]');
    }
}


