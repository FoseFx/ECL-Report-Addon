const path = require('path');
const webdriver = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

export default function beforeEachE2E() {
  const ffOptions = new firefox.Options()
    .headless()
    .setPreference('xpinstall.signatures.required', false)
    .setPreference('xpinstall.whitelist.required', false)
    .setPreference('network.proxy.type', 1)
    .setPreference('network.proxy.http', 'localhost')
    .setPreference('network.proxy.http_port', 8888)
    .setPreference('network.proxy.ssl', 'localhost')
    .setPreference('network.proxy.ssl_port', 8888)
    .setPreference('network.proxy.proxy_over_tls', true)
    .addExtensions(path.join(__dirname, '../dist/addon.xpi'));

  return new webdriver.Builder()
    .withCapabilities({
      acceptInsecureCerts: true
    })
    .forBrowser('firefox')
    .setFirefoxOptions(ffOptions)
    .build();
}
