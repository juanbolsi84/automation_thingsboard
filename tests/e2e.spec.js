import { test } from '../Utilities/Fixtures.js';
import { expect } from '@playwright/test';
import PomManager from '../Pages/PomManager.js';
import ApiUtil from '../Utilities/ApiUtil.js';
import MockUtil from '../Utilities/MockUtil.js';
import { readCsvFile } from '../Utilities/ReadCsvFile.js';
import dashboardData from '../Data/DashboardData.json' assert { type: 'json' };


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
    const mock = new MockUtil(page);

    // Step 1: Register the mock BEFORE navigating
    await mock.mockDevicesPaginated();

    // Step 2: Go to Devices page
    await pm.homePage.goToDevices();

    // Step 3: Verify first 10 devices on page 1
    await expect(page.locator(pm.devices.actions.rowsLocator)).toHaveCount(10);

    // Step 4: Click "Next" page
    await pm.devices.clickNextButton();

    // Step 5: Verify remaining 4 devices on page 2
    await expect(page.locator(pm.devices.actions.rowsLocator)).toHaveCount(4);
});

test('Create customer via UI using data from CSV file, delete via API', async ({auth}) => {
  // Read the CSV file
  const data = await readCsvFile('Data/Customers.csv');
  // Pick a random row from the file
  const customer = data[Math.floor(Math.random() * data.length)];
  // Create a unique customer by adding a suffix, to avoid data collisions in parallel runs
  customer.Title = `${customer.Title} ${Math.floor(Math.random() * 10000) + 1}`;

  await pm.homePage.goToCustomers();
  await pm.customers.createCustomer(customer);
  const customerCreated = await pm.customers.actions.waitForRow('created', customer.Title);
  expect(customerCreated).toBe(true);
  await api.deleteCustomerIfExists(customer.Title)
})

// Add test to create customer via API and delete via UI

test('Upload image to Image Gallery', async ({auth}) => {
  await pm.homePage.goToImageGallery();
  // Add a random suffix so the table name is unique
  const uniqueSuffix = Math.floor(Math.random() * 10000);
  await pm.imageGallery.uploadImage(uniqueSuffix);
  const rowCreated = await pm.devices.actions.waitForRow('created', `TopCat_${uniqueSuffix}.jpg`); //need to add the file name somewhere else. ENV file?
  expect(rowCreated).toBe(true);

  //need to add a way of deleting the row afterwards
})

// Add test to download image file and cleanup

test.only('Create dashboard', async ({auth}) => {
  await pm.homePage.goToDashboard();

  const data = dashboardData.defaultDashboard;
  data.title = `${data.title} ${Math.floor(Math.random() * 10000) + 1}`;

  await pm.dashboards.createDashboard(data);

  // need to add widgets

  //const rowCreated = await pm.dashboards.actions.waitForRow('created', data.title);
  //expect(rowCreated).toBe(true);


  

})

