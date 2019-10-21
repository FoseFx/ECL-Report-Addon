import beforeEachE2E from '../beforeEachE2E';

describe('SampleTest Suite', function() {
  let driver: any;

  beforeEach(() => driver = beforeEachE2E());

  it('should run the test', async () => {
    await driver.get('https://www.faceit.com');
    await driver.quit();
  });
});
