const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add a rule to handle ESM modules without extensions
  config.module.rules.push({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false,
    },
  });

  // Polyfill Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer/"),
    "vm": require.resolve("vm-browserify"),
    "process": require.resolve("process/browser"),
  };

  // Provide 'Buffer' and 'process' as global variables
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ]);

  return config;
};