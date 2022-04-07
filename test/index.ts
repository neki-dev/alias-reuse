import assert from 'assert';
import path from 'path';
import aliasReuse from '../src';

describe('alias reuse', () => {
  let alias;

  before(() => {
    alias = aliasReuse(__dirname);
  });

  describe('import', () => {
    it('should import from tsconfig', () => {
      const aliasTsconfig = alias.fromTsconfig('./mocks/tsconfig.json');
      const paths = aliasTsconfig.toObject();
      const result = Object.entries(paths);

      assert.equal(result[0][0], '~root/*');
      assert.equal(result[0][1], './src/*');
    });
  
    it('should import from webpack', () => {
      const aliasWebpack = alias.fromWebpack('./mocks/webpack.config.js');
      const paths = aliasWebpack.toObject();
      const result = Object.entries(paths);

      assert.equal(result[0][0], '~root/*');
      assert.equal(result[0][1], './src/*');
    });

    it('should import from vite', () => {
      const aliasVite = alias.fromVite('./mocks/vite.config.js');
      const paths = aliasVite.toObject();
      const result = Object.entries(paths);

      assert.equal(result[0][0], '~root/*');
      assert.equal(result[0][1], './src/*');
    });
  });

  describe('export', () => {
    let aliasObject;
  
    before(() => {
      aliasObject = alias.fromObject({
        '~root/*': './src/*',
        '~component/*': './src/components/*',
      });
    });
  
    it('should export to tsconfig', () => {
      const paths = aliasObject.toTsconfig();
      const result = Object.entries(paths);

      assert.equal(result[0][0], '~root/*');
      assert.equal(result[0][1][0], './src/*');
    });
  
    it('should export to webpack', () => {
      const paths = aliasObject.toWebpack();
      const result = Object.entries(paths);

      assert.equal(result[0][0], '~root');
      assert.equal(result[0][1], path.resolve(__dirname, 'src'));
    });
  
    it('should export to vite', () => {
      const paths = aliasObject.toVite();
      const result = Object.entries(paths);

      assert.equal(result[0][0], '~root');
      assert.equal(result[0][1], path.resolve(__dirname, 'src'));
    });
  
    it('should export to jest', () => {
      const paths = aliasObject.toJest();
      const result = Object.entries(paths);

      assert.equal(result[0][0], '~root/(.*)');
      assert.equal(result[0][1], '<rootDir>/src/$1');
    });
  });
});
