const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = function(context, options) {
  return {
    name: 'monaco-editor',
    configureWebpack(config, isServer) {
      return {
        module: {
          rules: [
            {
              test: /\.ttf$/,
              use: ['file-loader'],
            },
          ],
        },
        plugins: [
          new MonacoWebpackPlugin({
            languages: ['javascript', 'json'],
          }),
        ],
      };
    },
  };
};