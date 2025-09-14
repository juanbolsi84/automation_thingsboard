import { test, expect } from '@playwright/test';
import PomManager from '../Pages/PomManager.js';
import ApiUtil from '../Utilities/ApiUtil.js';

let pm;
let api;

test.describe('Create and Delete devices', () => {
  test.beforeAll(async () => {
    api = new ApiUtil();
    await api.init();
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test.beforeEach(async ({ page }) => {
    pm = new PomManager(page);
  });

  test('Create a device via UI', async ({ page }) => {
    await pm.loginPage.navigate();
    await pm.loginPage.login('tenant@thingsboard.org', 'tenant');
    await pm.homePage.goToDevices();

    const newDevice = {
      name: `Thermostat ${Math.floor(Math.random() * 10000) + 1}`,
      label: 'Machine Room',
      assignToCustomer: 'Customer A',
    };

    await pm.devices.createDevice(newDevice);

    const isCreated = await pm.devices.waitForColumn('created', newDevice.name);
    expect(isCreated).toBe(true);

    // Cleanup via API
    await api.deleteDeviceIfExists(newDevice.name);
  });

  test('Create a device via API, delete via UI', async ({ page }) => {
    const rndDeviceName = `Accelerometer ${Math.floor(Math.random() * 10000) + 1}`;
    await api.createDevice(rndDeviceName, 'Sensor');

    await pm.loginPage.navigate();
    await pm.loginPage.login('tenant@thingsboard.org', 'tenant');
    await pm.homePage.goToDevices();

    await pm.devices.deleteDevice('Name', rndDeviceName);

    const isDeleted = await pm.devices.waitForColumn('deleted', rndDeviceName);
    expect(isDeleted).toBe(true);
  });
});
