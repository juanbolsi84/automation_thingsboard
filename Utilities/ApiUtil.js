// Utilities/ApiUtil.js
import { request as pwRequest } from '@playwright/test';

export default class ApiUtil {
  /**
   * @param {string} [baseURL] - Base URL for API, fallback to .env or default
   * @param {string} [username] - API username, fallback to .env or default
   * @param {string} [password] - API password, fallback to .env or default
   */
  constructor(baseURL = process.env.TB_BASE_URL || 'http://localhost:8080', 
              username = process.env.TB_USERNAME || 'tenant@thingsboard.org', 
              password = process.env.TB_PASSWORD || 'tenant') {
    this.baseURL = baseURL;
    this.username = username;
    this.password = password;
    this.apiContext = null;
    this.token = null;
  }

  /**
   * Initialize API context and login
   */
  async init() {
    // Create a reusable request context
    this.apiContext = await pwRequest.newContext({
      baseURL: this.baseURL,
    });

    // Login via API
    const loginResp = await this.apiContext.post('/api/auth/login', {
      data: {
        username: this.username,
        password: this.password,
      },
    });

    if (!loginResp.ok()) {
      throw new Error(`Login failed with status ${loginResp.status()}`);
    }

    const body = await loginResp.json();
    this.token = body.token;
  }

  /**
   * Dispose API context
   */
  async dispose() {
    if (this.apiContext) {
      await this.apiContext.dispose();
    }
  }

  /**
   * Create a device via API
   */
  async createDevice(deviceName, type = 'default', label = '') {
    const resp = await this.apiContext.post('/api/device', {
      headers: { 'X-Authorization': `Bearer ${this.token}` },
      data: { name: deviceName, type, label },
    });

    if (!resp.ok()) {
      throw new Error(`Failed to create device via API: ${resp.status()}`);
    }
    return await resp.json();
  }

  /**
   * Delete a device via API if exists
   */
  async deleteDeviceIfExists(deviceName) {
    const searchResp = await this.apiContext.get(
      `/api/tenant/devices?deviceName=${encodeURIComponent(deviceName)}`,
      { headers: { 'X-Authorization': `Bearer ${this.token}` } }
    );

    const data = await searchResp.json();
    if (data?.id?.id) {
      await this.apiContext.delete(`/api/device/${data.id.id}`, {
        headers: { 'X-Authorization': `Bearer ${this.token}` },
      });
    }
  }

  /**
   * Create an asset via API
   */
  async createAsset(assetName, type = 'default', label = '') {
    await this.apiContext.post('/api/asset', {
      headers: { 'X-Authorization': `Bearer ${this.token}` },
      data: { name: assetName, type, label },
    });
  }

  /**
   * Delete an asset via API if exists
   */
  async deleteAssetIfExists(assetName) {
    const searchResp = await this.apiContext.get(
      `/api/tenant/assets?assetName=${encodeURIComponent(assetName)}`,
      { headers: { 'X-Authorization': `Bearer ${this.token}` } }
    );

    const data = await searchResp.json();
    if (data?.id?.id) {
      await this.apiContext.delete(`/api/asset/${encodeURIComponent(data.id.id)}`, {
        headers: { 'X-Authorization': `Bearer ${this.token}` },
      });
    }
  }

  //add create customer

  async deleteCustomerIfExists(customerName){
    const searchResp = await this.apiContext.get(
      `api/tenant/customers?customerTitle=${encodeURIComponent(customerName)}`,
      {headers: {'X-Authorization': `Bearer ${this.token}`}}
    );

    const data = await searchResp.json();
    if(data?.id?.id) {
      await this.apiContext.delete(`api/customer/${encodeURIComponent(data.id.id)}`, {
        headers: {'X-Authorization': `Bearer ${this.token}`}}
    )};
  }
}
