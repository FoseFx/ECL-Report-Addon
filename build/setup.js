const run = require('./run');

(async () => {
    await run("npm ci");
    process.chdir('form');
    await run("npm ci");
    process.chdir('../');    
})();
