const path = require('path');
const run = require('./run');
const arg = process.argv[2];

async function compressAndRename() {
  if (process.platform === 'win32') {
    const distPath = path.join(__dirname, '../dist');
    const addonPath = path.join(__dirname, '../dist/addon');
    await run(`powershell Compress-Archive -Path ${distPath}\\* -CompressionLevel Fastest -DestinationPath ${addonPath}`);
    await run(`Ren ${addonPath}.zip addon.xpi`);
    await run(`dir`);
  } else {
    process.chdir('dist');
    await run('zip -r addon.xpi *');
    process.chdir('../');
  }
}
async function buildProxy() {
  if (process.platform === 'win32') {
    await run('docker build -t ecl-proxy -f e2e/proxy/windows.Dockerfile e2e/proxy');
  }
  else {
    await run('docker build -t ecl-proxy e2e/proxy');
  }
}

(async () => {
  console.log('\n\x1b[32m%s\x1b[0m', 'Preparing End to End Tests');  
  if (arg !== '--no-build') {
    await run('npm run build:dev');
  }
  await compressAndRename(); // firefox .xpi file
  await buildProxy();
  await run('docker run --rm --name ecl-proxy -p 8888:8080 -d ecl-proxy');
  console.log('\x1b[32m%s\x1b[0m', 'Starting End to End Tests');
})();
