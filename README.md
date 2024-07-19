## ⚙️ Alias reuse
[![Version](https://badgen.net/npm/v/alias-reuse)](https://npmjs.com/package/alias-reuse)
[![Small size](https://img.badgesize.io/neki-dev/alias-reuse/master/dist/index.js)](https://github.com/neki-dev/alias-reuse/blob/master/dist/index.js)
[![Build](https://github.com/neki-dev/alias-reuse/actions/workflows/build.yml/badge.svg)](https://github.com/neki-dev/alias-reuse/actions/workflows/build.yml)
[![Test](https://github.com/neki-dev/alias-reuse/actions/workflows/test.yml/badge.svg)](https://github.com/neki-dev/alias-reuse/actions/workflows/test.yml)

Reuse custom or existing aliases from one configuration in others.

.

## Install

```sh
npm i alias-reuse --save-dev
```

.

## Usage

### Import 
Import aliases from existing configuration.
The library will automatically detect the configuration source type.

Supported configuration sources:
* `tsconfig`
* `webpack` / `vite`
* `object`
```ts
reuse().from(pathToConfig: string);
```
... and also from custom object.
```ts
reuse().from(config: Record<string, string>);
```

### Configure
Set custom root directory.
```ts
reuse().from(...).at(pathToRoot: string);
```

### Export 
Export of aliases in a required configuration target.

Supported configuration targets:
* `tsconfig`
* `webpack` / `vite`
* `jest`
* `object`
```ts
reuse().from(...).for(target: string);
```

.

## Examples

* #### Example for Webpack

```js
const { reuse } = require('alias-reuse');
const tsconfigPath = path.join(__dirname, 'tsconfig.json');

module.exports = {
  resolve: {
    alias: reuse()
      .from(tsconfigPath) // Import aliases from tsconfig.json
      .for("webpack"), // And convert to webpack format
  },
  // ...
};
```

* #### Example for TSConfig

```js
const { reuse } = require('alias-reuse');
const configPath = path.join(__dirname, 'configs/aliases.json');

module.exports = {
  compilerOptions: {
    paths: reuse()
      .from(configPath) // Import aliases from custom config
      .for("tsconfig"), // And convert to tsconfig format
  },
  // ...
};
```

* #### Example with custom root directory

```js
const { reuse } = require('alias-reuse');
const rootPath = path.join(__dirname, 'root');
const configPath = path.join(__dirname, 'configs/aliases.json');

module.exports = {
  resolve: {
    alias: reuse()
      .from(configPath) // Import aliases from custom config
      .at(rootPath) // Set root directory
      .for("vite"), // And convert to vite format
  },
  // ...
};
```
