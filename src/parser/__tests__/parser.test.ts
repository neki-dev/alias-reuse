import path from "path";

import { Parser } from "../index";

describe("parser", () => {
  it("should parse ts config", () => {
    const records = new Parser().from(
      path.resolve(__dirname, "../__mocks__/tsconfig.json"),
    ).records;

    expect(records).toEqual([
      { from: "~root/*", to: "../src/*" },
      { from: "components/*", to: "./src/components/*" },
      { from: "config", to: "/var/config" },
    ]);
  });

  it("should parse webpack config", () => {
    const records = new Parser().from(
      path.resolve(__dirname, "../__mocks__/webpack.config.js"),
    ).records;

    expect(records).toEqual([
      { from: "~root/*", to: "../src/*" },
      { from: "components/*", to: "./src/components/*" },
      { from: "config", to: "/var/config" },
    ]);
  });

  it("should parse vite config", () => {
    const records = new Parser().from(
      path.resolve(__dirname, "../__mocks__/vite.config.js"),
    ).records;

    expect(records).toEqual([
      { from: "~root/*", to: "../src/*" },
      { from: "components/*", to: "./src/components/*" },
      { from: "config", to: "/var/config" },
    ]);
  });

  it("should parse custom config from file", () => {
    const records = new Parser().from(
      path.resolve(__dirname, "../__mocks__/custom.config.js"),
    ).records;

    expect(records).toEqual([
      { from: "~root/*", to: "../src/*" },
      { from: "components/*", to: "./src/components/*" },
      { from: "config", to: "/var/config" },
    ]);
  });

  it("should parse custom config from object", () => {
    const records = new Parser().from({
      "~root/*": "../src/*",
      "components/*": "./src/components/*",
      config: "/var/config",
    }).records;

    expect(records).toEqual([
      { from: "~root/*", to: "../src/*" },
      { from: "components/*", to: "./src/components/*" },
      { from: "config", to: "/var/config" },
    ]);
  });
});
