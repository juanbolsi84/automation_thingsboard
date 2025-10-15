export default class CommonActions {
    constructor(page, columnName = null) {
        this.page = page;
        this.columnName = columnName;
    }

    // Getters for table element locators
    get optionsLocator() { return 'mat-option' };
    get headersLocator() { return 'mat-header-cell' };
    get rowsLocator() { return 'mat-row' };
    get cellLocator() { return 'mat-cell' };

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
        for (let i = 0; i < 50; i++) {
            options = await this.page.locator(this.optionsLocator).allTextContents(); // Get all option texts
            optionIndex = await options.findIndex(opt => opt.trim().includes(optionText)); // Find index of the desired option

            if (optionIndex != -1) {
                const optionLocator = this.page.locator(this.optionsLocator).nth(optionIndex); //Find the locator for the option
                await optionLocator.click(); // Click the matched option
                await optionLocator.waitFor({ state: 'hidden', timeout: 5000 }); // Wait until the option disappears (dropdown closed)
                return; // Exit after success
            }

            await this.page.waitForTimeout(300); // Poll every 200ms until option is found, avoids flakiness.

        }
    }

    async findRowByCellValue(valueToCheck, overrideColumnName = null) {
        const columnName = overrideColumnName || this.columnName;

        const headers = await this.page.locator(this.headersLocator).allTextContents();
        const colIndex = headers.findIndex(h => h.trim() === columnName);

        if (colIndex === -1) {
            throw new Error(`Column "${columnName}" not found among headers: ${headers}`);
        }

        const rows = await this.page.locator(this.rowsLocator);
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const cellTextRaw = await rows.nth(i).locator(this.cellLocator).nth(colIndex).textContent();            
            const cellText = cellTextRaw?.trim();
            if (cellText == valueToCheck) {
                return rows.nth(i);
            }
        }

        return null;
    }

    async waitForRow(action, valueToCheck, overrideColumnName = null) {
        for (let i = 0; i <= 50; i++) {
            const row = await this.findRowByCellValue(valueToCheck, overrideColumnName);
            if (action === 'created' && row) {
                return true;
            } else if (action === 'deleted' && !row) {
                return true;
            }
            await this.page.waitForTimeout(300);
        }
        return false;
    }

    async waitUntilEnabled(locator, timeout = 5000) {
        const loc = this.page.locator(locator); // Playwright locator
        await this.page.waitForFunction(
            (el) => el && !el.disabled, // check element exists and is not disabled
            await loc.elementHandle(),  // pass the raw DOM element, not the locator
            { timeout }
        );
    }

    async selectFromMultiDropdown(inputLocator, optionText) {
        // This funtion deals with dropdowns that don't automatically close after selecting an option
        await this.page.locator(inputLocator).click();
        let optionIndex = -1;
        let options = [];
        for (let i = 0; i < 50; i++) {
            options = await this.page.locator(this.optionsLocator).allTextContents(); // Get all option texts
            optionIndex = await options.findIndex(opt => opt.trim().includes(optionText)); // Find index of the desired option

            if (optionIndex != -1) {
                const optionLocator = this.page.locator(this.optionsLocator).nth(optionIndex); //Find the locator for the option
                await optionLocator.click(); // Click the matched option
                return; // Exit after success
            }

            await this.page.waitForTimeout(300); // Poll every 200ms until option is found, avoids flakiness.

        }
    }


}