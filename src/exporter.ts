import path from 'path';
import { Alias } from './types';

type Modificators = {
  alias: (value: string) => string
  path: (value: string) => any
};

export interface IExporter {
  toTsconfig: () => object
  toWebpack: () => object
  toVite: () => object
  toJest: () => object
}

export default function exporter(pathToRoot: string, aliases: Alias[]): IExporter {
  function transform(modificators: Modificators) {
    return aliases.reduce((curr, alias) => {
      const from = modificators.alias(alias.from);
      const to = modificators.path(alias.to);
      return { ...curr, [from]: to };
    }, {});
  }

  return {
    toTsconfig() {
      return transform({
        alias: (value) => value,
        path: (value) => [value],
      });
    },

    toWebpack() {
      return transform({
        alias: (value) => value.replace('/*', ''),
        path: (value) => path.resolve(pathToRoot, value.replace('/*', '')),
      });
    },

    toVite() {
      return transform({
        alias: (value) => value.replace('/*', ''),
        path: (value) => path.resolve(pathToRoot, value.replace('/*', '')),
      });
    },

    toJest() {
      return transform({
        alias: (value) => value.replace('*', '(.*)'),
        path: (value) => value.replace('./', '<rootDir>/').replace('*', '$1'),
      });
    },
  };
}
