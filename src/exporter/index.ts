import path from "path";

import { Record } from "../record";

import type { ExporterModificators, ExporterTarget } from "./types";

export class Exporter {
  public readonly records: Record[] = [];

  private pathToRoot: string;

  constructor(pathToRoot: string) {
    this.pathToRoot = pathToRoot;
  }

  public at(pathToRoot: string) {
    this.pathToRoot = pathToRoot;
    return this;
  }

  public addRecord(from: string, to: string) {
    const record = new Record(from, to);
    this.records.push(record);
  }

  private export(modificators: ExporterModificators = {}) {
    return this.records.reduce((current, alias) => {
      const from = modificators.alias
        ? modificators.alias(alias.from)
        : alias.from;
      const fullPath = path.resolve(this.pathToRoot, alias.to);
      const to = modificators.path ? modificators.path(fullPath) : fullPath;
      return {
        ...current,
        [from]: to,
      };
    }, {});
  }

  public for(target: ExporterTarget) {
    switch (target) {
      case 'tsconfig': return this.export({
        path: (value) => [value],
      });

      case 'vite':
      case 'webpack': return this.export({
        alias: (value) =>
          value.substring(value.length - 2, value.length) === "/*"
            ? value.replace("/*", "")
            : value + "$",
        path: (value) => value.replace("/*", ""),
      });

      case 'jest': return this.export({
        alias: (value) => value.replace("*", "(.*)"),
        path: (value) => value.replace("*", "$1"),
      });

      default: return this.export();
    }
  }
}

