import path from 'path';

import { Exporter } from '../exporter';

import type { ParserModificators } from './types';

export class Parser {
  private pathToConfig: string | null = null;

  /**
   * Read aliases from custom object.
   *
   * @param {Object} config - Custom object
   */
  public from(config: Record<string, string>): Exporter;
  /**
   * Read aliases from config file.
   *
   * @param {string} filePath - Path to one of config file
   */
  public from(filePath: string): Exporter;
  public from(entry: string | Record<string, string>): Exporter {
    const config = typeof entry === 'string' ? __non_webpack_require__(entry) : entry;

    this.pathToConfig =
      typeof entry === 'string' ? path.dirname(entry) : __dirname;

    // tsconfig
    if (config.compilerOptions) {
      if (!config.compilerOptions.paths) {
        throw Error('Aliases parsing error: \'compilerOptions.paths\' is not defined in tsconfig');
      }

      this.pathToConfig = path.resolve(
        this.pathToConfig,
        config.compilerOptions.rootDir ?? '',
      );

      return this.parse(config.compilerOptions.paths);
    }

    // webpack or vite
    if (config.resolve) {
      if (!config.resolve.alias) {
        throw Error('Aliases parsing error: \'resolve.alias\' is not defined in webpack/vite config');
      }

      return this.parse(config.resolve.alias, {
        alias: ({ alias }) => alias.endsWith('/*') ? alias : alias + '/*',
        path: ({ path }) => path.endsWith('/*') ? path : path + '/*',
      });
    }

    // jest
    if (config.moduleNameMapper) {
      return this.parse(config.moduleNameMapper, {
        alias: ({ alias }) => alias.replace(/^\^/, '').replace(/\$$/, '').replace(/\(\.\*\)/g, '*'),
        path: ({ path }) => path.replace('<rootDir>', '.').replace('./..', '..').replace(/\$\d+/g, '*'),
      });
    }

    // others
    return this.parse(config, {
      alias: ({ alias }) => alias.endsWith('/*') ? alias : alias + '/*',
      path: ({ path }) => path.endsWith('/*') ? path : path + '/*',
    });
  }

  private parse(
    config: Record<string, string | string[]> = {},
    modificators: ParserModificators = {},
  ) {
    if (!this.pathToConfig) {
      throw Error('Aliases parsing error: Undefined path to config');
    }

    const exporter = new Exporter(this.pathToConfig);
    Object.entries(config).forEach(([alias, path]) => {
      const payload = {
        alias,
        path: Array.isArray(path) ? path[0] : path,
      };
      exporter.addRecord(
        modificators.alias?.(payload) ?? payload.alias,
        modificators.path?.(payload) ?? payload.path,
      );
    });

    return exporter;
  }
}
