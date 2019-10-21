const run = require('./run');


(async () => {
  console.log('\n\x1b[32m%s\x1b[0m', 'Preparing End to End Tests');
  await run('npm run build:dev');
  process.chdir('dist');
  await run('zip -r addon.xpi *');
  process.chdir('../');
  console.log('\x1b[32m%s\x1b[0m', 'Starting End to End Tests');
  await run('npx jest --config jest.e2e.config.js');
  console.log('\n\x1b[32m%s\x1b[0m', 'End to End Tests Done\n\n');
})();
