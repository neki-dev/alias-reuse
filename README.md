## Alias reuse
[![Npm package version](https://badgen.net/npm/v/alias-reuse)](https://npmjs.com/package/alias-reuse)
[![Small size](https://badge-size.herokuapp.com/neki-dev/alias-reuse/master/dist/index.js)](https://github.com/neki-dev/alias-reuse/blob/master/dist/index.js)

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
alias(rootDir: string)
  .fromTsconfig/*Webpack,Vite,Object*/(pathToConfig: string)
  .forJest/*Tsconfig,Webpack,Vite*/()
```

* ### Example

```js
const alias = require('alias-reuse');

// webpack.config.js

module.exports = {
  resolve: {
    alias: alias(__dirname) // __dirname for root dir
        .fromTsconfig('./tsconfig.json')
        .forWebpack(),
  },
  // ...
};

// vite.config.js

module.exports = defineConfig({
  resolve: {
    alias: alias(__dirname) // __dirname for root dir
        .fromWebpack('./webpack.config.js')
        .forVite(),
  },
  // ...
});
```
