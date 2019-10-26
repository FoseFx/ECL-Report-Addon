import beforeEachE2E from '../beforeEachE2E';

describe('Report-Button E2E', () => {
  let driver: any;
  beforeEach(() => driver = beforeEachE2E());

  afterEach(async () => await driver.quit());

  it('should not show ecl report button when not logged in', async () => {
    await driver.get('https://www.faceit.com/de/csgo/room/1-2da54af5-f522-44c7-a15e-22c712f2dfbc');
    const res = await driver.findElements({css: 'match-team-member-v2'});
    for (const member of res) {
      const btns = await member.findElements({css: '.match-team-member__controls__button'});
      for (const btn of btns) {
        expect(await btn.getText()).not.toContain('ecl');
      }
    }
  });
  /*
  it('should show ecl report button when logged in', async () => {
    await driver.get('https://www.faceit.com/de/csgo/room/1-2da54af5-f522-44c7-a15e-22c712f2dfbc');
    await driver.findElement({linkText: 'Login'}).click();
    await driver.findElement({id: 'login_email'}).click();
    await driver.sleep(30000);
    const res = await driver.findElements({css: 'match-team-member-v2'});
    let eclsFound = 0;
    for (const member of res) {
      const btns = await member.findElements({css: '.match-team-member__controls__button'});
      for (const btn of btns) {
        if ((await btn.getText()).contains('ecl')) {
          eclsFound++;
        }
      }
    }
    expect(eclsFound).toEqual(9);
  });
*/
});
