const path = require("path");

module.exports = {
  entry: "./src/deepClone.js",
  output: {
    filename: "main.js",
    library: "omnicode",
    // libraryExport: 'default', for es6 export
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "dist")
  }
};
