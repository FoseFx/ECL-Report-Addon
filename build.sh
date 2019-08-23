rm -rf dist && # clean old dist folder
mkdir dist && # make new dist folder
tsc -b tsconfig.content_scripts.json && # transpile content_scripts and msg_broker
rm -rf dist/form && # we dont need this
sed -i 's/export //' dist/content_scripts/faceit.js &&# remove 'export' from file
sed -i 's/export //' dist/background/msg_broker.js && # x2
cp manifest.json dist/. && # copy manifest over
npm run build:build_vue # build form