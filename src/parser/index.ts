import path from "path";

import { Exporter } from "../exporter";

import type { ParserModificators } from "./types";

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
    const config = typeof entry === "string" ? __non_webpack_require__(entry) : entry;

    this.pathToConfig =
      typeof entry === "string" ? path.dirname(entry) : __dirname;

    // tsconfig
    if (config.compilerOptions) {
      this.pathToConfig = path.resolve(
        this.pathToConfig,
        config.compilerOptions.rootDir ?? "",
      );

      return this.parse(config.compilerOptions.paths);
    }

    // webpack or vite
    if (config.resolve) {
      return this.parse(config.resolve.alias, {
        alias: ({ alias }) =>
          alias.charAt(alias.length - 1) === "$"
            ? alias.substring(0, alias.length - 1)
            : alias + "/*",
        path: ({ alias, path }) =>
          alias.charAt(alias.length - 1) === "$" ? path : path + "/*",
      });
    }

    // others
    return this.parse(config);
  }

  private parse(
    config: Record<string, string | string[]> = {},
    modificators: ParserModificators = {},
  ) {
    if (!this.pathToConfig) {
      throw Error("Aliases parsing error: Undefined path to config");
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
