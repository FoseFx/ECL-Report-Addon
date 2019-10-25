const path = require('path');
const webdriver = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const chromium = require('selenium-webdriver/chrome');

const capabilities = {
  acceptInsecureCerts: true,
  proxy: {
    proxyType: 'manual',
    httpProxy: 'localhost:8888',
    sslProxy: 'localhost:8888'
  }
};

export default function beforeEachE2E() {
  const ffOptions = new firefox.Options()
    .headless()
    .setPreference('xpinstall.signatures.required', false)
    .setPreference('xpinstall.whitelist.required', false)
    .addExtensions(path.join(__dirname, '../dist/addon.xpi'));

  const chromeOptions = new chromium.Options()
    .addArguments(`--load-extension=${path.join(__dirname, '../dist')}`);

  // @ts-ignore
  if (global.BROWSER === 'firefox') {
    return new webdriver.Builder()
      .withCapabilities(capabilities)
      .forBrowser('firefox')
      .setFirefoxOptions(ffOptions)
      .build();
  }
  return new webdriver.Builder()
    .withCapabilities(capabilities)
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();
}
