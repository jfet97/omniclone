const path = require('path');

module.exports = {
    entry: './src/deepClone.js',
    output: {
        filename: 'main.js',
        library: 'omnicode',
        libraryExport: 'default',
        libraryTarget: 'commonjs2',
        path: path.resolve(__dirname, 'dist')
    }
};