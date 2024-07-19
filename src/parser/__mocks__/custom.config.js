const path = require('path');

module.exports = {
  '~root/*': '../src/*',
  'components/*': './src/components/*',
  'config': path.resolve('/var/www', '..', './config'),
};