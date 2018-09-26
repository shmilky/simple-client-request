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
        'react-router-routing-helpers': 'react-router-routing-helpers',
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