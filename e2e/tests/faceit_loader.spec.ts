import beforeEachE2E from '../beforeEachE2E';
import {waitForLoaded} from '../e2eutil';
const {By} = require('selenium-webdriver');

describe('FaceitLoader (e2e)', function() {
  let driver: any;
  let headElements: Array<any>;

  beforeAll(async () => {
    driver = beforeEachE2E();
    await driver.get('https://www.faceit.com');
    await waitForLoaded(driver, 10000);
    // get all document.head elements
    const head = await driver.executeScript('return document.head');
    headElements = await head.findElements(By.css('*'));
  });

  afterAll(async () => {
    await driver.quit();
  });

  it('should inject scripts into Faceit', async () => {
    let faceitScriptFound = false;
    let faceitBindingScriptFound = false;
    let appScriptFound = false;

    for (const element of headElements) {
      let tn: string;
      try {
        tn = await element.getTagName(); // get TagName
      } catch (e) {
        continue;
      }

      if (tn !== 'script') {
        continue;
      }
      const src: string = await element.getAttribute('src');
      if (src.endsWith('content_scripts/faceit.js')) {
        faceitScriptFound = true;
      } else if (src.endsWith('content_scripts/app.js')) {
        appScriptFound = true;
      } else if (src.endsWith('content_scripts/faceit_event_binding.js')) {
        faceitBindingScriptFound = true;
      }

    }
    expect(faceitScriptFound).toEqual(true);
    expect(faceitBindingScriptFound).toEqual(true);
    expect(appScriptFound).toEqual(true);

  });

  it('should inject CSS into Faceit', async () => {
    let appCssFound = false;
    let fontCssFound = false;
    let iconsCssFound = false;

    for (const element of headElements) {
      let tn: string;
      try {
        tn = await element.getTagName(); // get TagName
      } catch (e) {
        continue;
      }
      if (tn === 'link') {
        const rel = await element.getAttribute('rel');
        if (rel !== 'stylesheet') {
          continue;
        }
        const href: string = await element.getAttribute('href');

        if (href.endsWith('content_scripts/app.css')) {
          appCssFound = true;
        } else if (href === 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900') {
          fontCssFound = true;
        } else if (href === 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css') {
          iconsCssFound = true;
        }
      }

    }

    expect(appCssFound).toEqual(true);
    expect(fontCssFound).toEqual(true);
    expect(iconsCssFound).toEqual(true);
  });

  it('should attach the Vue-Form to Faceit', async () => {
    const appEl = await driver.findElement(By.id('ecl_addon_popup_wrapper'));
    expect(appEl).not.toBe(null);
  });
});
