import { Exporter } from '..';

describe('exporter', () => {
  let exporter: Exporter;

  beforeEach(() => {
    console.log(__dirname);

    exporter = new Exporter('/var/test');
    exporter.addRecord('~root/*', '../src/*');
    exporter.addRecord('components/*', './src/components/*');
    exporter.addRecord('config', '/etc/config');
  });

  it('should export for ts config', () => {
    const paths = exporter.for('tsconfig');

    expect(paths).toEqual({
      '~root/*': ['/var/src/*'],
      'components/*': ['/var/test/src/components/*'],
      'config': ['/etc/config'],
    });
  });

  it('should export for webpack', () => {
    const paths = exporter.for('webpack');

    expect(paths).toEqual({
      '~root': '/var/src',
      'components': '/var/test/src/components',
      'config': '/etc/config',
    });
  });

  it('should  export for vite', () => {
    const paths = exporter.for('vite');

    expect(paths).toEqual({
      '~root': '/var/src',
      'components': '/var/test/src/components',
      'config': '/etc/config',
    });
  });

  it('should export for jest', () => {
    const paths = exporter.for('jest');

    expect(paths).toEqual({
      '^~root/(.*)$': '/var/src/$1',
      '^components/(.*)$': '/var/test/src/components/$1',
      '^config$': '/etc/config',
    });
  });

  it('should export as object', () => {
    const paths = exporter.for('object');

    expect(paths).toEqual({
      '~root/*': '/var/src/*',
      'components/*': '/var/test/src/components/*',
      'config': '/etc/config',
    });
  });

  it('should export as object with custom root', () => {
    const paths = exporter.at('/var/custom').for('object');

    expect(paths).toEqual({
      '~root/*': '/var/src/*',
      'components/*': '/var/custom/src/components/*',
      'config': '/etc/config',
    });
  });
});
