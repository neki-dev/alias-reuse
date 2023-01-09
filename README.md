## ⚙️ Alias reuse
[![Npm package version](https://badgen.net/npm/v/alias-reuse)](https://npmjs.com/package/alias-reuse)
[![Small size](https://img.badgesize.io/neki-dev/alias-reuse/master/src/index.js)](https://github.com/neki-dev/alias-reuse/blob/master/src/index.js)
[![Testing](https://github.com/neki-dev/alias-reuse/actions/workflows/test.yml/badge.svg)](https://github.com/neki-dev/alias-reuse/actions/workflows/test.yml)

Parse exists config with aliases and export for webpack, vite, jest and others

* Import from tsconfig, webpack vite and custom object
* Export to tsconfig, webpack, vite and jest

.

* ### Install

```sh
npm i alias-reuse --save-dev
```

* ### Usage

```js
alias(pathToRoot: string)
  .fromXXX(pathToConfig: string) // XXX - Tsconfig, Webpack, Vite, Object
  .toYYY() // YYY - Tsconfig, Webpack, Vite, Jest
```

* ### Example

```js
const alias = require('alias-reuse');

// webpack.config.js

module.exports = {
  resolve: {
    alias: alias(__dirname) // __dirname for root dir
        .fromTsconfig('./tsconfig.json')
        .toWebpack(),
  },
  // ...
};

// vite.config.js

module.exports = defineConfig({
  resolve: {
    alias: alias(__dirname) // __dirname for root dir
        .fromWebpack('./webpack.config.js')
        .toVite(),
  },
  // ...
});
```
