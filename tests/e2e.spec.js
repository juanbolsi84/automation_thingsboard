import { test, expect, request as pwRequest } from '@playwright/test';
import PomManager from '../Pages/PomManager.js';

let pm;
let apiContext;
let token;

test.describe('Create and Delete devices', () => {

    test.beforeAll(async () => {
        // Create isolated API context
        apiContext = await pwRequest.newContext({
            baseURL: 'http://localhost:8080', // adjust if needed
        });

        // Login and grab token
        const loginResp = await apiContext.post('/api/auth/login', {
            data: {
                username: 'tenant@thingsboard.org',
                password: 'tenant',
            },
        });
        const body = await loginResp.json();
        token = body.token;
    });

    test.afterAll(async () => {
        await apiContext.dispose();
    });

    async function deleteDeviceIfExists(deviceName) {
        const searchResp = await apiContext.get(
            `/api/tenant/devices?deviceName=${encodeURIComponent(deviceName)}`,
            { headers: { 'X-Authorization': `Bearer ${token}` } }
        );
        const data = await searchResp.json();

        if (data?.id?.id) {
            await apiContext.delete(`/api/device/${data.id.id}`, {
                headers: { 'X-Authorization': `Bearer ${token}` },
            });
        }
    }

    async function createDeviceViaApi(deviceName, label = '') {
        const resp = await apiContext.post('/api/device', {
            headers: { 'X-Authorization': `Bearer ${token}` },
            data: {
                name: deviceName,
                type: 'default', // adjust type if your ThingsBoard instance uses something else
                label,
            },
        });
        if (!resp.ok()) {
            throw new Error(`Failed to create device via API: ${resp.status()}`);
        }
        return await resp.json();
    }

    test.beforeEach(async ({ page }) => {
        pm = new PomManager(page);
        // Ensure clean state before each test
        await deleteDeviceIfExists('Boiler Thermostat');
        await deleteDeviceIfExists('Generator Accelerometer');
    });

    test.afterEach(async () => {
        // Cleanup after each test
        await deleteDeviceIfExists('Boiler Thermostat');
        await deleteDeviceIfExists('Generator Accelerometer');
    });

    test('Create a device', async ({ page }) => {
        await pm.loginPage.navigate();
        await pm.loginPage.login('tenant@thingsboard.org', 'tenant');
        await pm.homePage.goToDevices();

        const newDevice = {
            name: 'Boiler Thermostat',
            label: 'Machine Room',
            assignToCustomer: 'Customer A',
        };

        await pm.devices.createDevice(newDevice);
        const isCreated = await pm.devices.waitForColumn('created', 'Boiler Thermostat');
        expect(isCreated).toBe(true);
        
    });

    test('Create a device through API, delete in UI ', async ({ page }) => {
        // Step 1: Create device via API
        await createDeviceViaApi('Generator Accelerometer', 'Sensor');

        // Step 2: Log in and go to Devices page
        await pm.loginPage.navigate();
        await pm.loginPage.login('tenant@thingsboard.org', 'tenant');
        await pm.homePage.goToDevices();

        // Step 3: Delete device via UI
        await pm.devices.deleteDevice('Name', 'Generator Accelerometer');
        const isDeleted = await pm.devices.waitForColumn('deleted', 'Generator Accelerator');
        expect(isDeleted).toBe(true);

    });
});
