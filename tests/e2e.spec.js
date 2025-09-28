// tests/login.spec.js
import { test, expect, request } from '@playwright/test';
import PomManager from '../Pages/PomManager.js';
import ApiUtil from '../Utilities/ApiUtil.js';

let pm;
let api;

/**
 * Decode JWT payload without extra dependencies
 * @param {string} token
 * @returns {object} payload
 */
function decodeJwt(token) {
  const payload = token.split('.')[1];
  return JSON.parse(Buffer.from(payload, 'base64').toString());
}

test.beforeAll(async () => {
  // Initialize API utility once
  api = new ApiUtil();
  await api.init();
});

test.beforeEach(async ({ page, baseURL }) => {
  // 1) Login via API
  const loginContext = await request.newContext({ baseURL });
  const loginResp = await loginContext.post('/api/auth/login', {
    data: { username: process.env.TB_USERNAME, password: process.env.TB_PASSWORD },
  });
  const body = await loginResp.json();
  await loginContext.dispose();

  if (!body.token || !body.refreshToken) throw new Error('Login failed');

  // 2) Decode JWT payloads to get expiration in milliseconds
  const jwtPayload = decodeJwt(body.token);
  const refreshPayload = decodeJwt(body.refreshToken);
  const jwtExpMs = (jwtPayload.exp * 1000).toString();     // like 1759107117772
  const refreshExpMs = (refreshPayload.exp * 1000).toString();

  // 3) Inject localStorage before page loads
  await page.addInitScript(({ t, tExp, r, rExp }) => {
    localStorage.setItem('jwt_token', t);
    localStorage.setItem('jwt_token_expiration', tExp);
    localStorage.setItem('refresh_token', r);
    localStorage.setItem('refresh_token_expiration', rExp);
  }, { t: body.token, tExp: jwtExpMs, r: body.refreshToken, rExp: refreshExpMs });

  // 4) Navigate to home page (ThingsBoard will read tokens immediately)
  await page.goto(process.env.TB_HOMEPAGE || baseURL, { waitUntil: 'networkidle' });

  // 5) Optional debug: verify localStorage
  const ls = await page.evaluate(() => ({
    jwt_token: localStorage.getItem('jwt_token'),
    jwt_token_expiration: localStorage.getItem('jwt_token_expiration'),
    refresh_token: localStorage.getItem('refresh_token'),
    refresh_token_expiration: localStorage.getItem('refresh_token_expiration'),
  }));
  console.log('LocalStorage after injection:', ls);

  // 6) Initialize Page Object Manager
  pm = new PomManager(page);
});

test.describe('Devices', () => {
  test('Create a device via UI', async () => {
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

  test('Create a device via API, delete via UI', async () => {
    const rndDeviceName = `Accelerometer ${Math.floor(Math.random() * 10000) + 1}`;
    await api.createDevice(rndDeviceName, 'Sensor');

    await pm.homePage.goToDevices();
    await pm.devices.deleteDevice('Name', rndDeviceName);

    const rowDeleted = await pm.devices.actions.waitForRow('deleted', rndDeviceName);
    expect(rowDeleted).toBe(true);
  });
});

test.describe('Assets', () => {
  test('Create an asset via UI, delete via API', async () => {
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

  test('Create an asset via API, delete via UI', async () => {
    const newAssetName = `Infrared ${Math.floor(Math.random() * 10000) + 1}`;
    await api.createAsset(newAssetName);

    await pm.homePage.goToAssets();
    await pm.assets.actions.findRowByCellValue('Name', newAssetName);
    await pm.assets.deleteAsset('Name', newAssetName);

    const assetDeleted = await pm.assets.actions.waitForRow('deleted', newAssetName);
    expect(assetDeleted).toBe(true);
  });
});
