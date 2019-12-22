const path = require('path')

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    main: "./src/js/main.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist/js")
  }
}