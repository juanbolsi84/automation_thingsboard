import { test } from '../Utilities/Fixtures.js';
import { expect } from '@playwright/test';
import PomManager from '../Pages/PomManager.js';
import ApiUtil from '../Utilities/ApiUtil.js';
import MockUtil from '../Utilities/MockUtil.js';


let pm;
let api;

test.beforeAll(async () => {
  // Initialize API utility once
  api = new ApiUtil();
  await api.init();
});

test.beforeEach(async ({ page, baseURL }, testInfo) => {
  // Initialize Page Object Manager
  pm = new PomManager(page);
});

test('Manual login', async({page}) => {
  await pm.loginPage.navigate();
  await pm.loginPage.login(process.env.TB_USERNAME || 'tenant@thingsboard.org', process.env.TB_PASSWORD || 'tenant');
  await expect(page).toHaveTitle('ThingsBoard | Home');
});

test.describe('Devices', () => {
  test('Create a device via UI', async ({auth}) => {
    await pm.homePage.goToDevices();

    const newDevice = {
      name: `Thermostat ${Math.floor(Math.random() * 10000) + 1}`,
      label: 'Machine Room',
      assignToCustomer: 'Customer C',
    };

    await pm.devices.createDevice(newDevice);

    const rowCreated = await pm.devices.actions.waitForRow('created', newDevice.name);
    expect(rowCreated).toBe(true);

    // Cleanup via API
    await api.deleteDeviceIfExists(newDevice.name);
  });

  test('Create a device via API, delete via UI', async ({auth}) => {
    const rndDeviceName = `Accelerometer ${Math.floor(Math.random() * 10000) + 1}`;
    await api.createDevice(rndDeviceName, 'Sensor');

    await pm.homePage.goToDevices();
    await pm.devices.deleteDevice('Name', rndDeviceName);

    const rowDeleted = await pm.devices.actions.waitForRow('deleted', rndDeviceName);
    expect(rowDeleted).toBe(true);
  });
});

test.describe('Assets', () => {
  test('Create an asset via UI, delete via API', async ({auth}) => {
    await pm.homePage.goToAssets();

    const newAsset = {
      name: `Boiler ${Math.floor(Math.random() * 10000) + 1}`,
      assignToCustomer: 'Customer B',
      description: 'This is a brief description of the asset',
    };

    await pm.assets.createAsset(newAsset);

    const assetCreated = await pm.assets.actions.waitForRow('created', newAsset.name);
    expect(assetCreated).toBe(true);

    // Cleanup via API
    await api.deleteAssetIfExists(newAsset.name);
  });

  test('Create an asset via API, delete via UI', async ({auth}) => {
    const newAssetName = `Infrared ${Math.floor(Math.random() * 10000) + 1}`;
    await api.createAsset(newAssetName);

    await pm.homePage.goToAssets();
    await pm.assets.actions.findRowByCellValue('Name', newAssetName);
    await pm.assets.deleteAsset('Name', newAssetName);

    const assetDeleted = await pm.assets.actions.waitForRow('deleted', newAssetName);
    expect(assetDeleted).toBe(true);
  });
});



test('Devices page shows 14 mocked devices with pagination', async ({ page, auth }) => {
    const pm = new PomManager(page);
    const mock = new MockUtil(page);

    // Step 1: Register the mock BEFORE navigating
    await mock.mockDevicesPaginated();

    // Step 2: Go to Devices page
    await pm.homePage.goToDevices();

    // Step 3: Verify first 10 devices on page 1
    await expect(page.locator('mat-row.mat-mdc-row')).toHaveCount(10);

    // Step 4: Click "Next" page
    await page.getByRole('button', { name: 'Next page' }).click();

    // Step 5: Verify remaining 4 devices on page 2
    await expect(page.locator('mat-row.mat-mdc-row')).toHaveCount(4);
});