/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import path from 'path';
import { Alias } from './types';
import exporter, { IExporter } from './exporter';

type Modificators = {
  alias?: (value: string) => string
  path?: (value: any) => string
};

type CustomAliases = {
  [from: string]: string
};

interface IImporter {
  fromObject: (object: CustomAliases) => IExporter
  fromTsconfig: (pathToConfig?: string) => IExporter
  fromWebpack: (pathToConfig?: string) => IExporter
  fromVite: (pathToConfig?: string) => IExporter
}

export default function importer(pathToRoot: string): IImporter {
  function transform(source: any, modificators: Modificators = {}) {
    const aliases: Alias[] = Object.entries(source).map(([from, to]) => ({
      from: modificators.alias ? modificators.alias(from) : from,
      to: modificators.path ? modificators.path(to) : String(to),
    }));

    return exporter(pathToRoot, aliases);
  }

  return {
    fromObject(object: CustomAliases) {
      return transform(object);
    },

    fromTsconfig(pathToConfig: string = 'tsconfig.json') {
      const tsconfig = require(path.resolve(pathToRoot, pathToConfig));
      return transform(tsconfig.compilerOptions.paths, {
        path: (value) => value[0],
      });
    },

    fromWebpack(pathToConfig: string = 'webpack.config.js') {
      const webpack = require(path.resolve(pathToRoot, pathToConfig));
      return transform(webpack.resolve.alias, {
        alias: (value) => `${value}/*`,
        path: (value) => `./${path.relative(pathToRoot, value)}/*`,
      });
    },

    fromVite(pathToConfig: string = 'vite.config.js') {
      const vite = require(path.resolve(pathToRoot, pathToConfig));
      return transform(vite.resolve.alias, {
        alias: (value) => `${value}/*`,
        path: (value) => `./${path.relative(pathToRoot, value)}/*`,
      });
    },
  };
}
