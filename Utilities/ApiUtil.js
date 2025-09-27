import { request as pwRequest } from '@playwright/test';

export default class ApiUtil {
  constructor(baseURL = 'http://localhost:8080') {
    this.baseURL = baseURL;
    this.apiContext = null;
    this.token = null;
  }

  async init() {
    this.apiContext = await pwRequest.newContext({
      baseURL: this.baseURL,
    });

    const loginResp = await this.apiContext.post('/api/auth/login', {
      data: {
        username: 'tenant@thingsboard.org',
        password: 'tenant',
      },
    });

    if (!loginResp.ok()) {
      throw new Error(`Login failed with status ${loginResp.status()}`);
    }

    const body = await loginResp.json();
    this.token = body.token;
  }

  async dispose() {
    if (this.apiContext) {
      await this.apiContext.dispose();
    }
  }

  async createDevice(deviceName, type = 'default', label = '') {
    const resp = await this.apiContext.post('/api/device', {
      headers: { 'X-Authorization': `Bearer ${this.token}` },
      data: {
        name: deviceName,
        type,
        label,
      },
    });

    if (!resp.ok()) {
      throw new Error(`Failed to create device via API: ${resp.status()}`);
    }
    return await resp.json();
  }

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

  async createAsset(assetName, type = 'default', label = '') {
    await this.apiContext.post('/api/asset', {
      headers: { 'X-Authorization': `Bearer ${this.token}` }, data: {
        name: assetName,
        type,
        label,
      }
    }
    )
  }

  async deleteAssetIfExists(assetName) {
    const searchResp = await this.apiContext.get(`/api/tenant/assets?assetName=${encodeURIComponent(assetName)}`, {
      headers: { 'X-Authorization': `Bearer ${this.token}` },
    });
    const data = await searchResp.json();
    if(data?.id?.id){
      await this.apiContext.delete(`/api/asset/${encodeURIComponent(data.id.id)}`, {headers: {'X-Authorization': `Bearer ${this.token}`}});

    }
  }
}
