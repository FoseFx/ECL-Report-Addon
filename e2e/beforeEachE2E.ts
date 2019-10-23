const path = require('path');
const webdriver = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

export default function beforeEachE2E() {
  const ffOptions = new firefox.Options()
    .headless()
    .setPreference('xpinstall.signatures.required', false)
    .setPreference('xpinstall.whitelist.required', false)
    .addExtensions(path.join(__dirname, '../dist/addon.xpi'));

  return new webdriver.Builder()
    .withCapabilities({
      acceptInsecureCerts: true,
      proxy: {
        proxyType: 'manual',
        httpProxy: 'localhost:8888',
        sslProxy: 'localhost:8888'
      }
    })
    .forBrowser('firefox')
    .setFirefoxOptions(ffOptions)
    .build();
}
