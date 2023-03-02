const assert = require('assert');
const path = require('path');
const alias = require('../src/index');

describe('alias reuse', () => {
  describe('reading', () => {
    it('should read ts config', () => {
      const paths = alias
        .fromFile(__dirname, './mocks/tsconfig.json')
        .toObject();
      const result = Object.entries(paths);

      assert.equal(result[0][0], '~root/*');
      assert.equal(result[0][1], './src/*');
    });

    it('should read webpack config', () => {
      const paths = alias
        .fromFile(__dirname, './mocks/webpack.config.js')
        .toObject();
      const result = Object.entries(paths);

      assert.equal(result[0][0], '~root/*');
      assert.equal(result[0][1], './src/*');
    });

    it('should read vite config', () => {
      const paths = alias
        .fromFile(__dirname, './mocks/vite.config.js')
        .toObject();
      const result = Object.entries(paths);

      assert.equal(result[0][0], '~root/*');
      assert.equal(result[0][1], './src/*');
    });

    it('should read custom config', () => {
      const paths = alias
        .fromFile(__dirname, './mocks/custom.config.js')
        .toObject();
      const result = Object.entries(paths);

      assert.equal(result[0][0], '~root/*');
      assert.equal(result[0][1], './src/*');
    });

    it('should read object', () => {
      const paths = alias
        .fromObject(__dirname, {
          '~root/*': './src/*',
          '~component/*': './src/components/*',
        })
        .toObject();
      const result = Object.entries(paths);

      assert.equal(result[0][0], '~root/*');
      assert.equal(result[0][1], './src/*');
    });
  });

  describe('converting', () => {
    let ac;

    before(() => {
      ac = alias.fromObject(__dirname, {
        '~root/*': './src/*',
        '~component/*': './src/components/*',
      });
    });

    it('should convert to ts config', () => {
      const paths = ac.toTSConfig();
      const result = Object.entries(paths);

      assert.equal(result[0][0], '~root/*');
      assert.equal(result[0][1][0], './src/*');
    });

    it('should convert to webpack config', () => {
      const paths = ac.toWebpack();
      const result = Object.entries(paths);

      assert.equal(result[0][0], '~root');
      assert.equal(result[0][1], path.resolve(__dirname, 'src'));
    });

    it('should convert to vite config', () => {
      const paths = ac.toVite();
      const result = Object.entries(paths);

      assert.equal(result[0][0], '~root');
      assert.equal(result[0][1], path.resolve(__dirname, 'src'));
    });

    it('should convert to jest config', () => {
      const paths = ac.toJest();
      const result = Object.entries(paths);

      assert.equal(result[0][0], '~root/(.*)');
      assert.equal(result[0][1], '<rootDir>/src/$1');
    });

    it('should convert to object', () => {
      const paths = ac.toObject();
      const result = Object.entries(paths);

      assert.equal(result[0][0], '~root/*');
      assert.equal(result[0][1], './src/*');
    });
  });
});
