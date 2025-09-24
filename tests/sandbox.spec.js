import { test, expect } from '@playwright/test';
import PomManager from '../Pages/PomManager.js';



let pm;

test.beforeEach(async ({ page }) => {
    pm = new PomManager(page);
  });

test.only("Create a new Asset", async ({page}) => {
    await pm.loginPage.navigate();
    await pm.loginPage.login('tenant@thingsboard.org', 'tenant');
    await pm.homePage.goToAssets();
    const newAsset = {
        name: `Boiler ${Math.floor(Math.random() * 10000) + 1}`,
        assignToCustomer: 'Customer B',
        description: 'This is a brief description of the asset'
    }
    await pm.assets.createAsset(newAsset);
    const assetCreated = await pm.assets.actions.waitForRow('created', newAsset.name);
    await expect(assetCreated).toBe(true);
    
})