const run = require('./run');

(async () => {
  console.log('\n\x1b[32m%s\x1b[0m', 'Setting up Addon Development Environment');
  await run("npm ci");
  process.chdir('form');
  await run("npm ci");
  process.chdir('../');
  console.log('\n\x1b[32m%s\x1b[0m', 'Done\n\n');
})().catch(e => {
  console.error(e);
  process.exit(1);
});
