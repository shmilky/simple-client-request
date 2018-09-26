'use strict';

const path = require('path');

module.exports = {
    entry: './src/clientRequest.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, './bin'),
        libraryTarget: 'commonjs2'
    },
    externals: {
        '@propertech/react-router-routing-helpers': '@propertech/react-router-routing-helpers',
        '@propertech/shared': '@propertech/shared',
        "es6-promise": "es6-promise",
        "isomorphic-fetch": "isomorphic-fetch",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015'],
                        plugins: ['transform-object-rest-spread']
                    }
                }
            }
        ]
    }
};