const path = require('path')
const nodeExternals = required('webpack-node-externals')

module.exports = {
    target: 'node',
    mode: 'production',
    externals: [nodeExternals()], // removes node_modules from your final bundle
    entry: './dist/server.js', // make sure this matches the main root of your code 
    output: {
      path: path.join(__dirname, 'deploy'), // this can be any path and directory you want
      filename: 'server.bundle.js',
    },
    optimization: {
      minimize: true, // enabling this reduces file size and readability
    },
  };