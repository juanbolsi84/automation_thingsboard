// Utilities/AuthUtil.js
import { request } from '@playwright/test';

export default class AuthUtil {
  constructor(page, baseURL) {
    this.page = page;
    this.baseURL = baseURL;
  }

  /**
   * Decode JWT payload without extra dependencies
   * @param {string} token
   * @returns {object} payload
   */
  decodeJwt(token) {
    const payload = token.split('.')[1];
    return JSON.parse(Buffer.from(payload, 'base64').toString());
  }

  /**
   * Logs in via API and injects tokens into localStorage before page load
   */
  async login() {
    // 1) Login via API
    const loginContext = await request.newContext({ baseURL: this.baseURL });
    const loginResp = await loginContext.post('/api/auth/login', {
      data: { username: process.env.TB_USERNAME, password: process.env.TB_PASSWORD },
    });
    const body = await loginResp.json();
    await loginContext.dispose();

    if (!body.token || !body.refreshToken) {
      throw new Error('Login failed');
    }

    // 2) Decode JWT payloads to get expiration in milliseconds
    const jwtPayload = this.decodeJwt(body.token);
    const refreshPayload = this.decodeJwt(body.refreshToken);
    const jwtExpMs = (jwtPayload.exp * 1000).toString();     // like 1759107117772
    const refreshExpMs = (refreshPayload.exp * 1000).toString();

    // 3) Inject localStorage before page loads
    await this.page.addInitScript(({ t, tExp, r, rExp }) => {
      localStorage.setItem('jwt_token', t);
      localStorage.setItem('jwt_token_expiration', tExp);
      localStorage.setItem('refresh_token', r);
      localStorage.setItem('refresh_token_expiration', rExp);
    }, { t: body.token, tExp: jwtExpMs, r: body.refreshToken, rExp: refreshExpMs });

    // 4) Navigate to home page (ThingsBoard will read tokens immediately)
    await this.page.goto(process.env.TB_HOMEPAGE || this.baseURL, { waitUntil: 'networkidle' });

    /* 5) Optional debug: verify localStorage
    const ls = await this.page.evaluate(() => ({
      jwt_token: localStorage.getItem('jwt_token'),
      jwt_token_expiration: localStorage.getItem('jwt_token_expiration'),
      refresh_token: localStorage.getItem('refresh_token'),
      refresh_token_expiration: localStorage.getItem('refresh_token_expiration'),
    }));
    console.log('LocalStorage after injection:', ls); */
  }
}
