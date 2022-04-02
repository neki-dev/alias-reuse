import { Alias } from "./types";

import path from 'path';

type Modificators = {
  alias: (value: string) => string
  path: (value: string) => any
}

export interface IExporter {
  forTsconfig: () => object,
  forWebpack: () => object,
  forVite: () => object,
  forJest: () => object,
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
    forTsconfig() {
      return transform({
        alias: (value) => value,
        path: (value) => [value],
      });
    },

    forWebpack() {
      return transform({
        alias: (value) => value.replace('/*', ''),
        path: (value) => path.resolve(pathToRoot, value.replace('/*', '')),
      });
    },

    forVite() {
      return transform({
        alias: (value) => value.replace('/*', ''),
        path: (value) => path.resolve(pathToRoot, value.replace('/*', '')),
      });
    },

    forJest() {
      return transform({
        alias: (value) => value.replace('*', '(.*)'),
        path: (value) => value.replace('./', '<rootDir>/').replace('*', '$1'),
      });
    },
  };
};
