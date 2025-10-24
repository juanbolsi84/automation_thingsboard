export default class CommonActions {
    constructor(page, columnName = null) {
        this.page = page;
        this.columnName = columnName;
    }

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

    get optionsLocator() { return 'mat-option'; }

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

    get headersLocator() { return this.page.locator('mat-header-cell') };
    get rowsLocator() { return this.page.locator('mat-row') };
    get cellLocator() { return this.page.locator('mat-cell') };
    get headersLocatorInDrawer() { return this.page.locator('mat-drawer mat-header-cell') };
    get rowsLocatorInDrawer() { return this.page.locator('mat-drawer mat-row') };

    async findRowByCellValue(valueToCheck, overrideColumnName = null, inDrawer = false) {

        // Use overrideColumnName if provided, or this.column if no argument provided
        const columnName = overrideColumnName || this.columnName;

        //Evaluate if the table is inside a drawer and pick the selectors accordingly
        const headersLocator = inDrawer ? this.headersLocatorInDrawer : this.headersLocator;
        const rowsLocator = inDrawer ? this.rowsLocatorInDrawer : this.rowsLocator;

        // Get the text of each header and add them to an array
        const headers = await headersLocator.allTextContents();

        // Find the index in the array for the colum name we want. If the column we passed is not found, throw an error for debugging
        const colIndex = headers.findIndex(h => h.trim() == columnName);
        if (colIndex === -1) throw new Error(`Column "${columnName}" not found`);

        // Count the number of rows
        const rowCount = await rowsLocator.count();

        // Go through all rows for the column and check if they match the value we passed
        for (let i = 0; i < rowCount; i++) {
            const cellTextRaw = await rowsLocator.nth(i).locator(this.cellLocator).nth(colIndex).textContent();
            const cellText = cellTextRaw?.trim();
            if (cellText?.includes(valueToCheck.toString())) {
                return rowsLocator.nth(i);
            }
        }

        return null;

    }

    async findCellValue(row, headerName, inDrawer = false) {
        // Evaluate what locators to use, depending on whether the table is inside a drawer
        const headersLocator = inDrawer ? this.headersLocatorInDrawer : this.headersLocator;

        // Get the text contents of all headers into an array
        const headers = await headersLocator.allTextContents();

        //Find the column number of the header we passed to the function
        const colIndex = headers.findIndex(h => h.trim() == headerName);
        if (colIndex === -1) throw new Error(`Column "${headerName}" not found`);

        // Get the value of the cell we want
        const rawCellValue = await row.locator(this.cellLocator).nth(colIndex).textContent();
        const cellValue = rawCellValue.trim();

        return cellValue;

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

    async waitForApiResponseAfterAction(endpointSubstring, refreshAction, statusCode = 200, timeout = 10000) {
    // Attach listener first
    const [response] = await Promise.all([
        this.page.waitForResponse(
            response =>
                response.url().includes(endpointSubstring) &&
                response.status() === statusCode,
            { timeout }
        ),
        // Trigger the UI action *after listener is attached*
        (async () => {
            await refreshAction();
        })()
    ]);

    return response;
}



}
