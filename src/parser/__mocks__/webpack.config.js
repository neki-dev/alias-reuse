const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '~root': '../src',
      'components': './src/components',
      'config$': path.resolve('/var/www', '..', './config'),
    },
  },
};
