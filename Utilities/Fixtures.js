// Fixture to start tests logged in
import base, { request } from '@playwright/test';

export const test = base.extend({
  auth: async ({ page, baseURL }, use) => {
    // 1- Login via API
    const loginContext = await request.newContext({ baseURL });
    const loginResp = await loginContext.post('/api/auth/login', {
      data: {
        username: process.env.TB_USERNAME,
        password: process.env.TB_PASSWORD,
      },
    });
    const body = await loginResp.json();
    await loginContext.dispose();

    if (!body.token || !body.refreshToken) {
      throw new Error('Login failed');
    }

    // 2- Decode JWT to get expiration timestamps
    const decode = token =>
      JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    const jwtExpMs = (decode(body.token).exp * 1000).toString();
    const refreshExpMs = (decode(body.refreshToken).exp * 1000).toString();

    // 3- Inject tokens into localStorage BEFORE navigation
    await page.addInitScript(
      ({ t, tExp, r, rExp }) => {
        localStorage.setItem('jwt_token', t);
        localStorage.setItem('jwt_token_expiration', tExp);
        localStorage.setItem('refresh_token', r);
        localStorage.setItem('refresh_token_expiration', rExp);
      },
      {
        t: body.token,
        tExp: jwtExpMs,
        r: body.refreshToken,
        rExp: refreshExpMs,
      }
    );

    // 4- Navigate to the homepage (authenticated)
    await page.goto(process.env.TB_HOMEPAGE || baseURL);

    // 5- Pass page control back to the test
    await use(page);
  },
});
