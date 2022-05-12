const path = require('path');

/**
 * Create importer instance.
 * 
 * @param {string} pathToRoot - Root directory path
 */
function importer(pathToRoot) {
  function transform(source, modificators = {}) {
    const aliases = Object.entries(source).map(([from, to]) => ({
      from: modificators.alias ? modificators.alias(from) : from,
      to: modificators.path ? modificators.path(to) : String(to),
    }));

    return exporter(pathToRoot, aliases);
  }

  return {
    /**
     * Read paths from custom object.
     * 
     * @param {Object} object - Custom object
     */
    fromObject(object) {
      return transform(object);
    },

    /**
     * Read paths from Typescript config
     * 
     * @param {string?} pathToConfig - Path to config file
     */
    fromTsconfig(pathToConfig = 'tsconfig.json') {
      const tsconfig = require(path.resolve(pathToRoot, pathToConfig));
      return transform(tsconfig.compilerOptions.paths, {
        path: (value) => value[0],
      });
    },

    /**
     * Read paths from Webpack config
     * 
     * @param {string?} pathToConfig - Path to config file
     */
    fromWebpack(pathToConfig = 'webpack.config.js') {
      const webpack = require(path.resolve(pathToRoot, pathToConfig));
      return transform(webpack.resolve.alias, {
        alias: (value) => `${value}/*`,
        path: (value) => `./${path.relative(pathToRoot, value)}/*`,
      });
    },

    /**
     * Read paths from Vite config
     * 
     * @param {string?} pathToConfig - Path to config file
     */
    fromVite(pathToConfig = 'vite.config.js') {
      const vite = require(path.resolve(pathToRoot, pathToConfig));
      return transform(vite.resolve.alias, {
        alias: (value) => `${value}/*`,
        path: (value) => `./${path.relative(pathToRoot, value)}/*`,
      });
    },
  };
}

function exporter(pathToRoot, aliases) {
  function transform(modificators = {}) {
    return aliases.reduce((curr, alias) => {
      const from = modificators.alias ? modificators.alias(alias.from) : alias.from;
      const to = modificators.path ? modificators.path(alias.to) : alias.to;
      return { ...curr, [from]: to };
    }, {});
  }

  return {
    /**
     * Convert paths to object.
     */
    toObject() {
      return transform();
    },

    /**
     * Convert paths to Typescript config format.
     */
    toTsconfig() {
      return transform({
        path: (value) => [value],
      });
    },

    /**
     * Convert paths to Webpack config format.
     */
    toWebpack() {
      return transform({
        alias: (value) => value.replace('/*', ''),
        path: (value) => path.resolve(pathToRoot, value.replace('/*', '')),
      });
    },

    /**
     * Convert paths to Vite config format.
     */
    toVite() {
      return transform({
        alias: (value) => value.replace('/*', ''),
        path: (value) => path.resolve(pathToRoot, value.replace('/*', '')),
      });
    },

    /**
     * Convert paths to Jest config format.
     */
    toJest() {
      return transform({
        alias: (value) => value.replace('*', '(.*)'),
        path: (value) => value.replace('./', '<rootDir>/').replace('*', '$1'),
      });
    },
  };
}

module.exports = importer;