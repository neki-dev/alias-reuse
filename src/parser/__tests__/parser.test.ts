import path from 'path';

import { Parser } from '../index';

describe('parser', () => {
  global.__non_webpack_require__ = require;

  it('should parse ts config', () => {
    const records = new Parser().from(
      path.resolve(__dirname, '../__mocks__/tsconfig.json'),
    ).records;

    expect(records).toEqual([
      { from: '~root/*', to: '../src/*' },
      { from: 'components/*', to: './components/*' },
      { from: 'config', to: '/etc/config' },
    ]);
  });

  it('should parse webpack config', () => {
    const records = new Parser().from(
      path.resolve(__dirname, '../__mocks__/webpack.config.js'),
    ).records;

    expect(records).toEqual([
      { from: '~root/*', to: '../src/*' },
      { from: 'components/*', to: './components/*' },
      { from: 'config/*', to: '/etc/config/*' },
    ]);
  });

  it('should parse vite config', () => {
    const records = new Parser().from(
      path.resolve(__dirname, '../__mocks__/vite.config.js'),
    ).records;

    expect(records).toEqual([
      { from: '~root/*', to: '../src/*' },
      { from: 'components/*', to: './components/*' },
      { from: 'config/*', to: '/etc/config/*' },
    ]);
  });

  it('should parse jest config', () => {
    const records = new Parser().from(
      path.resolve(__dirname, '../__mocks__/jest.config.js'),
    ).records;

    expect(records).toEqual([
      { from: '~root/*', to: '../src/*' },
      { from: 'components/*', to: './components/*' },
      { from: 'config', to: '/etc/config' },
    ]);
  });

  it('should parse custom config from file', () => {
    const records = new Parser().from(
      path.resolve(__dirname, '../__mocks__/custom.config.js'),
    ).records;

    expect(records).toEqual([
      { from: '~root/*', to: '../src/*' },
      { from: 'components/*', to: './components/*' },
      { from: 'config/*', to: '/etc/config/*' },
    ]);
  });

  it('should parse custom config from object', () => {
    const records = new Parser().from({
      '~root': '../src',
      'components': './components',
      'config': '/etc/config',
    }).records;

    expect(records).toEqual([
      { from: '~root/*', to: '../src/*' },
      { from: 'components/*', to: './components/*' },
      { from: 'config/*', to: '/etc/config/*' },
    ]);
  });
});
