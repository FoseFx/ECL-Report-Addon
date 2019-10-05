const run = require('./run');
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const arg = process.argv[2];

console.log(process.platform);

async function removeDir(dir) {
    console.log('remove', dir);
    
    if (process.platform === 'win32') {
        try {
            await run(`rd /s /q "${dir}"`);
        } catch (_) {
            console.log(dir + ' does not exist, could not remove it');
        }
    } else {
        await run('rm -rf ' + dir);
    }
}

function replaceInFile(file, find, replace) {
    const content = fs.readFileSync(file, 'utf-8');
    const ncontent = content.replace(new RegExp(find, "g"), replace);
    fs.writeFileSync(file, ncontent, 'utf-8');
}

(async () => {
    await removeDir("dist");  // clean old dist folder
    await run("mkdir dist");  // make new dist folder
    await run("cp -r icons dist/icons");  // copy icons directory
    await run("npm run tsc:" + arg);  // transpile content_scripts and msg_broker
    await removeDir("dist/form");  // we dont need this
    replaceInFile(path.join(process.cwd(), 'dist/content_scripts/faceit.js'), 'export', ''); // remove 'export' from file
    replaceInFile(path.join(process.cwd(), 'dist/background/msg_broker.js'), 'export', ''); // x2
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
    
})().catch(e => {
    console.error(e);
    process.exit(1);
});
