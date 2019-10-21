const run = require('./run');


(async () => {
  await run('npm run build:dev');
  process.chdir('dist');
  await run('zip -r addon.xpi *');
  process.chdir('../');
  await run('npx jest --config jest.e2e.config.js');
})();
