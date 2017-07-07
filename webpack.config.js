const path = require('path')

module.exports = {
  entry: {
    app: './src/index.js',
  },

  output: {
    filename: 'bundle.js',
    path: __dirname + '/build',
  },

  module: {
    rules: [
      {
        test: /\.js$/,

        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'test'),
        ],

        loader: 'babel-loader',
      },
    ],
  },
}
