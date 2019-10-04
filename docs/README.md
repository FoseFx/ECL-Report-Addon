<h1>Developer Documentation</h1>

> Notice:<br>
> These documents are meant for developers.
<hr>

## Before you continue
Have a look at the [Setup Guide][setup] in the root README and set up a development environment.

## Files
This project is divided into multiple directories.




| Path             	| Purpose                                                                                   	|
|------------------	|-------------------------------------------------------------------------------------------	|
| /docs            	| This directory                                                                           	|
| /.github         	| Files for Github Integration (Issue Templates, Workflows, ...)                           	|
| /build           	| Contains scripts called by npm (build, test, lint)                                       	|
| /content_scripts 	|  The scripts injected into faceit.com and report.ecl.gg according to `manifest.json`.    	|
| [/form][form]            	| The UI that is used to ask for additional information from the user. Written in Vue.     	|
| /background      	| Contains the message broker that proxies messages between the form and the content_script 	|
| /dist            	| Contains the build made by running `npm run build:[prod|dev]` in the root of this repo. [How to install the builds][install-build] 	|


Note that npm will generate the `node_modules` directories during [setup][setup], it contains all dependencies.

## Diagram

![docs-image]

[setup]: ../README.md#for-developers
[install-build]: ../README.md#install-builds
[form]: ../form/README.md
[docs-image]: visual.png
