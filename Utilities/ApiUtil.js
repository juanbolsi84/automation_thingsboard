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

  /* Powershell command for device telemetry:
    curl.exe -v -X POST http://localhost:8080/api/v1/ABGYs8NOs2o27yX4e7GZ/telemetry -H "Content-Type: application/json" -d '{\"temperature\":25}' */

  async findDeviceToken(deviceName){
    // 1- Get the device's id from the device name
    const deviceInfo = await this.apiContext.get(
      `api/tenant/devices?deviceName=${encodeURIComponent(deviceName)}`,
      {headers: {'X-Authorization': `Bearer ${this.token}`}}
    );

    const deviceInfoData = await deviceInfo.json();
    const deviceId = deviceInfoData?.id?.id;

    // 2- Get the device's token, using its id
    const deviceCredentials = await this.apiContext.get(
      `api/device/${encodeURIComponent(deviceId)}/credentials`,
      {headers: {'X-Authorization': `Bearer ${this.token}`}}
    );

    const deviceCredentialsData = await deviceCredentials.json();
    const deviceToken = deviceCredentialsData?.credentialsId

    return deviceToken;
      
    };

  async sendTelemetry(deviceToken, temperatureValue){
    await this.apiContext.post(`api/v1/${deviceToken}/telemetry`, 
      {headers: {'Content-Type': 'application/json'}, 
      data: {temperature: temperatureValue}}
    );

  }

}
