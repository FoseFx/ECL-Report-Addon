const Xvfb = require('xvfb');
const xvfb = new Xvfb();
const run = require('./run');

(async function() {
  xvfb.startSync();
  await run('npx jest --config jest.e2e.config.chrome.js');
  xvfb.stopSync();
})();
