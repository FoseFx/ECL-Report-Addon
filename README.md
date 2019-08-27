# ECL Report Addon 
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v1.4%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md) ![GitHub](https://img.shields.io/github/license/Fosefx/ECL-Report-Addon) [![Maintainability](https://api.codeclimate.com/v1/badges/53d21221c122857a0678/maintainability)](https://codeclimate.com/github/FoseFx/ECL-Report-Addon/maintainability) [![codecov](https://codecov.io/gh/FoseFx/ECL-Report-Addon/branch/master/graph/badge.svg)](https://codecov.io/gh/FoseFx/ECL-Report-Addon) [![Travis Build](https://travis-ci.com/FoseFx/ECL-Report-Addon.svg?branch=master)](https://travis-ci.com/FoseFx/ECL-Report-Addon) 

# THIS ADDON IS WORK IN PROGRESS AND CURRENTLY: NOT WORKING

(Name and patent pending :P)
# For users

Did you discover something strage or want to request a new feature?
PM me [on twitter](https://www.twitter.com/FoseFx) or write me an [email](mailto:info@fosefx.com) or even better: [open an issue](https://github.com/FoseFx/ECL-Report-Addon/issues/new).



# For Developers
If you want to contribute to this project make sure you read the [CODE OF CONDUCT](CODE_OF_CONDUCT.md) and are familier with [How to contribute to open source](https://opensource.guide/how-to-contribute/#a-checklist-before-you-contribute). Read the [CONTRIBUTING.md](CONTRIBUTING.md).

## Building
> Note: The `npm run` commands are written for *NIX-systems and probably wont work for windows users

0. Make sure you have npm installed
1. Clone this repo: `git clone git@github.com:FoseFx/ECL-Report-Addon.git`
2. Install Dependencies `./setup.sh`
3. Build the extention for development using `npm run build:dev`
4. Build the extention for production using `npm run build:prod`

## Testing
In order to be merged your code must be tested.
This project uses the [jest](https://jestjs.io/) test runner.

Run `npm test` to run all tests and to generate a coverage report (open using `firefox coverage/lconv-report/index.html`)

## Linting
Code style and readability is important! Use `npm run lint` to check if your code is compliant, if not try `npm run lint:fix` and/or manualy fix it.

# TODO
- Finish MinorForm
- Going live
- Dev: Windows support
- Bug fixes
