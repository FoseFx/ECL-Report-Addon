const run = require('./run');

(async () => {
    await run("npm ci");
    process.chdir('form');
    await run("npm ci");
    process.chdir('../');    
})().catch(e => {
    console.error(e);
    process.exit(1);
});
