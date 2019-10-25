// This file gets executed after jest
// has started, see ../jest.e2e.conf.js
jest.setTimeout(60000); // 60s
// @ts-ignore
global.BROWSER = 'chrome';
console.log(' == E2E TESTING CHROME == ');
