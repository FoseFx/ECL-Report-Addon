const {Condition} = require('selenium-webdriver');


export async function waitForLoaded(driver: any, timeout: number) {
  await driver.wait(
    new Condition(
      'on Faceit to be ready',
      async () => {
        const res = await driver.executeScript('return document.readyState');
        return res === 'complete';
      }
    ),
    timeout
  );
}
