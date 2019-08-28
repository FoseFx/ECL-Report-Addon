const run = require('./run');
const glob = require('glob');
const arg = process.argv[2];

async function removeDir(dir) {
    if (process.platform === 'win32') {
        await run('rd /s /q "' + dir + '"');
    } else {
        await run('rm -rf ' + dir);
    }
}

(async () => {
    await removeDir("dist");  // clean old dist folder
    await run("mkdir dist");  // make new dist folder
    await run("npm run tsc:" + arg);  // transpile content_scripts and msg_broker
    await removeDir("dist/form");  // we dont need this
    await run("sed -i 's/export //' dist/content_scripts/faceit.js");  // remove 'export' from file
    await run("sed -i 's/export //' dist/background/msg_broker.js");  // x2
    await run("cp node_modules/webextension-polyfill/dist/browser-polyfill.min.js dist/browser-polyfill.min.js");  // copy polyfill to scripts
    await run("cp manifest.json dist/.");  // copy manifest over
    process.chdir('form');
    await run("npm run build");  // build form
    await run("cp -r dist/js/* ../dist/content_scripts");  // copy files to the right place
    await run("cp dist/css/* ../dist/content_scripts"); 
    process.chdir('../');


    if (arg === "prod") {
        const jsFiles = glob.sync('dist/**/*.js');
        console.log("\nCompressing\n");
        
        for (const file of jsFiles) {
            await run(`npx terser --compress --mangle -o ${file} -- ${file}`);
        }
    }
    console.log("\n\n");
    
})().catch(_ => process.exit(1));
