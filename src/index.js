const path = require('path');

/**
 * Convert aliases to target config
 *
 * @param {Object[]} aliases - Aliases list
 * @param {Object} [modificators] - Convertation rules
 */
function writeConfig(aliases, modificators = {}) {
  return aliases.reduce((curr, alias) => {
    const from = modificators.alias
      ? modificators.alias(alias.from)
      : alias.from;
    const to = modificators.path ? modificators.path(alias.to) : alias.to;

    return { ...curr, [from]: to };
  }, {});
}

/**
 * Create exporter instance.
 *
 * @param {string} pathToRoot - Root directory path
 * @param {Object[]} aliases - Aliases list
 */
function exporter(pathToRoot, aliases) {
  return {
    /**
     * Convert paths to object.
     */
    toObject() {
      return writeConfig(aliases);
    },

    /**
     * Convert paths to Typescript config format.
     */
    toTSConfig() {
      return writeConfig(aliases, {
        path: (value) => [value],
      });
    },

    /**
     * Convert paths to Webpack config format.
     */
    toWebpack() {
      return writeConfig(aliases, {
        alias: (value) => value.replace('/*', ''),
        path: (value) => path.resolve(pathToRoot, value.replace('/*', '')),
      });
    },

    /**
     * Convert paths to Vite config format.
     */
    toVite() {
      return writeConfig(aliases, {
        alias: (value) => value.replace('/*', ''),
        path: (value) => path.resolve(pathToRoot, value.replace('/*', '')),
      });
    },

    /**
     * Convert paths to Jest config format.
     */
    toJest() {
      return writeConfig(aliases, {
        alias: (value) => value.replace('*', '(.*)'),
        path: (value) => value.replace('./', '<rootDir>/').replace('*', '$1'),
      });
    },
  };
}

/**
 * Convert config to normalized object
 *
 * @param {string} pathToRoot - Root directory path
 * @param {Object} config - Raw config
 * @param {Object} [modificators] - Convertation rules
 */
function readConfig(pathToRoot, config, modificators = {}) {
  const aliases = Object.entries(config).map(([from, to]) => ({
    from: modificators.alias ? modificators.alias(from) : from,
    to: modificators.path ? modificators.path(to) : String(to),
  }));

  return exporter(pathToRoot, aliases);
}

/**
 * Read aliases from config.
 *
 * @param {string} pathToRoot - Root directory path
 * @param {string} pathToConfig - Aliases config path
 */
function fromFile(pathToRoot, pathToConfig) {
  const config = require(pathToConfig);

  // tsconfig
  if (config.compilerOptions) {
    if (config.compilerOptions.paths) {
      return readConfig(pathToRoot, config.compilerOptions.paths, {
        path: (value) => value[0],
      });
    }

    return readConfig(pathToRoot, {});
  }

  // webpack or vite
  if (config.resolve) {
    if (config.resolve.alias) {
      return readConfig(pathToRoot, config.resolve.alias, {
        alias: (value) => `${value}/*`,
        path: (value) => `./${path.relative(pathToRoot, value)}/*`,
      });
    }

    return readConfig(pathToRoot, {});
  }

  // custom config
  return readConfig(pathToRoot, config);
}

/**
 * Read aliases from object.
 *
 * @param {string} pathToRoot - Root directory path
 * @param {Object} config - Aliases object
 */
function fromObject(pathToRoot, config) {
  return readConfig(pathToRoot, config);
}

module.exports = {
  fromFile,
  fromObject,
};
