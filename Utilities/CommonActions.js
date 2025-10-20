export default class CommonActions {
    constructor(page, columnName = null) {
        this.page = page;
        this.columnName = columnName;
    }

    // Table element locators
    get optionsLocator() { return 'mat-option'; }
    get headersLocator() { return 'mat-header-cell'; }
    get rowsLocator() { return 'mat-row'; }
    get cellLocator() { return 'mat-cell'; }

    async navigate(url) {
        await this.page.goto(url);
    }

    async fill(locator, text) {
        if (typeof locator === 'string') {
            await this.page.fill(locator, text);
        } else {
            await locator.fill(text);
        }
    }

    async click(locator) {
        if (typeof locator === 'string') {
            await this.page.click(locator);
        } else {
            await locator.click();
        }
    }

    async getText(locator) {
        if (typeof locator === 'string') {
            return await this.page.innerText(locator);
        } else {
            return await locator.innerText();
        }
    }

    async expandIfCollapsed(toggleLocator, menuLocator) {
        const menuVisible = typeof menuLocator === 'string'
            ? await this.page.isVisible(menuLocator)
            : await menuLocator.isVisible();

        if (!menuVisible) {
            await this.click(toggleLocator);
        }
    }

    async selectOption(locator, option) {
        if (typeof locator === 'string') {
            await this.page.selectOption(locator, option);
        } else {
            await locator.selectOption(option);
        }
    }

    async selectFromDropdown(inputLocator, optionText) {
        // Accept string or locator
        const input = typeof inputLocator === 'string' ? this.page.locator(inputLocator) : inputLocator;
        await input.click();

        let optionIndex = -1;
        let options = [];
        for (let i = 0; i < 100; i++) {
            options = await this.page.locator(this.optionsLocator).allTextContents();
            optionIndex = options.findIndex(opt => opt.trim().includes(optionText));
            if (optionIndex !== -1) {
                const optionLocator = this.page.locator(this.optionsLocator).nth(optionIndex);
                await optionLocator.click();
                await optionLocator.waitFor({ state: 'hidden', timeout: 5000 });
                return;
            }
            await this.page.waitForTimeout(300);
        }
    }

    async selectFromMultiDropdown(inputLocator, optionText) {
        const input = typeof inputLocator === 'string' ? this.page.locator(inputLocator) : inputLocator;
        await input.click();

        let optionIndex = -1;
        for (let i = 0; i < 100; i++) {
            const options = await this.page.locator(this.optionsLocator).allTextContents();
            optionIndex = options.findIndex(opt => opt.trim() === optionText);
            if (optionIndex !== -1) {
                const optionLocator = this.page.locator(this.optionsLocator).nth(optionIndex);
                await optionLocator.click();
                return;
            }
            await this.page.waitForTimeout(300);
        }
    }

    async findRowByCellValue(valueToCheck, overrideColumnName = null) {
        const columnName = overrideColumnName || this.columnName;

        const headers = await this.page.locator(this.headersLocator).allTextContents();
        const colIndex = headers.findIndex(h => h.trim() === columnName);
        if (colIndex === -1) throw new Error(`Column "${columnName}" not found`);

        const rows = this.page.locator(this.rowsLocator);
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const cellTextRaw = await rows.nth(i).locator(this.cellLocator).nth(colIndex).textContent();
            const cellText = cellTextRaw?.trim();
            if (cellText === valueToCheck) return rows.nth(i);
        }

        return null;
    }

    async waitForRow(action, valueToCheck, overrideColumnName = null) {
        for (let i = 0; i <= 100; i++) {
            const row = await this.findRowByCellValue(valueToCheck, overrideColumnName);
            if ((action === 'created' && row) || (action === 'deleted' && !row)) return true;
            await this.page.waitForTimeout(300);
        }
        return false;
    }

    async waitUntilEnabled(locator, timeout = 10000) {
        const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await this.page.waitForFunction(
            el => el && !el.disabled,
            await loc.elementHandle(),
            { timeout }
        );
    }

    async waitForTableToLoad() {
        await this.page.locator('text=Loading...').waitFor({ state: 'hidden' });
    }
}
