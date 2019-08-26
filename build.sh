rm -rf dist && # clean old dist folder
mkdir dist && # make new dist folder
tsc -b tsconfig.content_scripts.$1.json && # transpile content_scripts and msg_broker
rm -rf dist/form && # we dont need this
sed -i 's/export //' dist/content_scripts/faceit.js &&# remove 'export' from file
sed -i 's/export //' dist/background/msg_broker.js && # x2
cp node_modules/webextension-polyfill/dist/browser-polyfill.min.js dist/browser-polyfill.min.js && # copy polyfill to scripts
cp manifest.json dist/. && # copy manifest over
cd form && 
npm run build && # build form
cp -r dist/js/* ../dist/content_scripts && # copy files to the right place
cp dist/css/* ../dist/content_scripts &&
cd ..
