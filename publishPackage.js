const Promise = require('bluebird');
const packageJson = require('./package.json');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const publisher = require('auto-package-publish');

function beforePublishing () {
    const compile = Promise.promisify(webpack);

    return compile(webpackConfig);
}

function afterPublishing () {
    return new Promise (function () {
        console.log(`Finished publishing ${packageJson.name}`);
    });
}

publisher(packageJson, beforePublishing, afterPublishing);