export default class CommonActions {
    constructor(page) {
        this.page = page;
    }

    async navigate(url) {
        await this.page.goto(url);
    }

    async fill(locator, text) {
        await this.page.fill(locator, text);

    }

    async click(locator) {
        if (typeof locator === 'string') {
            await this.page.click(locator);
        } else {
            await locator.click(); // handle Locator object directly
        }
    }

    async getText(locator) {
        return await this.page.innerText(locator);

    }

    async expandIfCollapsed(toggleLocator, menuLocator) {
        const isVisible = await this.page.isVisible(menuLocator);
        if (!isVisible) {
            await this.page.click(toggleLocator);
        }
    }

    async selectOption(locator, option) {
        await this.page.selectOption(locator, option);
    }

    async selectFromDropdown(inputLocator, optionText) {
        // Angular Material backdrop sometimes blocks clicks, therefore the need of this routine
        await this.page.locator(inputLocator).click();
            let optionIndex = -1;
            let options = [];
            for (let i = 0; i < 30; i++) {
                options = await this.page.locator('mat-option').allTextContents(); // Get all option texts
                optionIndex = options.findIndex(opt => opt.trim() === optionText); // Find index of the desired option

                if (optionIndex != -1) {
                    await this.page.locator('mat-option').nth(optionIndex).click(); // Click the matched option
                    
                }

                await this.page.waitForTimeout(200); // Poll every 200ms until option is found, avoids flakiness.

            }
    }


}