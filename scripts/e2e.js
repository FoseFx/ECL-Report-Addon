const run = require('./run');
const arg = process.argv[2];

(async () => {
  console.log('\n\x1b[32m%s\x1b[0m', 'Preparing End to End Tests');  
  if (arg !== '--no-build') {
    await run('npm run build:dev');
  }
  process.chdir('dist');
  await run('zip -r addon.xpi *');
  process.chdir('../');
  await run('docker build -t ecl-proxy e2e/proxy');
  await run('docker run --rm --name ecl-proxy -p 8888:8080 -d ecl-proxy');
  console.log('\x1b[32m%s\x1b[0m', 'Starting End to End Tests');
})();
