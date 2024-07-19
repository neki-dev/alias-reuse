import { Exporter } from "../index";

describe("exporter", () => {
  let exporter: Exporter;

  beforeEach(() => {
    exporter = new Exporter(__dirname);
    exporter.addRecord("~root/*", "../src/*");
    exporter.addRecord("components/*", "./src/components/*");
    exporter.addRecord("config", "/var/config");
  });

  it("should export for ts config", () => {
    const paths = exporter.at('/root').for("tsconfig");

    expect(paths).toEqual({
      "~root/*": ["/src/*"],
      "components/*": ["/root/src/components/*"],
      "config": ["/var/config"],
    });
  });

  it("should export for webpack", () => {
    const paths = exporter.at('/root').for("webpack");

    expect(paths).toEqual({
      "~root": "/src",
      "components": "/root/src/components",
      "config$": "/var/config",
    });
  });

  it("should  export for vite", () => {
    const paths = exporter.at('/root').for("vite");

    expect(paths).toEqual({
      "~root": "/src",
      "components": "/root/src/components",
      "config$": "/var/config",
    });
  });

  it("should export for jest", () => {
    const paths = exporter.at("/root").for("jest");

    expect(paths).toEqual({
      "~root/(.*)": "/src/$1",
      "components/(.*)": "/root/src/components/$1",
      "config": "/var/config",
    });
  });

  it("should export as object", () => {
    const paths = exporter.at("/root").for("object");

    expect(paths).toEqual({
      "~root/*": "/src/*",
      "components/*": "/root/src/components/*",
      "config": "/var/config",
    });
  });
});
