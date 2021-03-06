# better-name
[![CircleCI](https://circleci.com/gh/Quramy/better-name.svg?style=svg)](https://circleci.com/gh/Quramy/better-name)
[![Coverage Status](https://coveralls.io/repos/github/Quramy/better-name/badge.svg?branch=master)](https://coveralls.io/github/Quramy/better-name?branch=master)
[![npm version](https://badge.fury.io/js/better-name.svg)](https://badge.fury.io/js/better-name)

A CLI to move JavaScript(ES2015) module files keeping dependencies.

If you have the following JavaScript files coupled with import/export dependencies and you want to refactor via moving the `target.js` to another directory.

```js
// src/index.js

import { someFn } from './oldFile';

export default function main() {
  someFn();
}
```

```js
// src/oldFile.js

export function someFn() {
  return 'test';
}
```

This CLI keeps their dependencies. In other words, after `better-name src/oldFile.js src/feat/newFile.js`, the import declaration in the `index.js` file gets updated with the new dependencies:

```js
// src/index.js

import { someFn } from './feat/newFile';

export default function main() {
  someFn();
}
```

## Install

```sh
npm -g install better-name
```

## Usage

```sh
better-name [options] <fromFile> <toFile>
```

Exec `better-name --help` if you want more details :smile:

### Configure

#### Project file patterns

By default, this CLI searches files to be replaced via `src/**/*.{js,jsx,mjs,ts,tsx}` glob pattern.
You can customize the glob pattern with `--pattern` option or configuring in package.json:

```js
  /* package.json */
  "betterName": {
    "patterns": [
      "src/javascript/**/*.{js,jsx}",
      "src/styles/**/*.css"
    ]
  },
```

#### Root import
Root path mapping using [babel-plugin-root-import](https://github.com/entwicklerstube/babel-plugin-root-import) is supported.
Path mapping configuration is loaded automaticcaly if your .babelrc has `babel-plugin-root-import` section.

You also can configure path mapping via package.json such as:

```js
  /* package.json */
  "betterName": {
    "rootImport": [{
      "rootPathPrefix": "~",
      "rootPathSuffix": "src/js"
    }, {
      "rootPathPrefix": "@",
      "rootPathSuffix": "other-src/js"
    }, {
      "rootPathPrefix": "#",
      "rootPathSuffix": "../../src/in/parent"
    }]
  }
```

If you want to avoid prefixing after replacing, `--normalize-root-import` CLI option or the following package.json setting is available:

```js
  /* package.json */
  "betterName": {
    "normalizeRootImport": true
  }
```

#### Format with Prettier
This CLI format your code after replace import declarations if your project has Prettier config file(.prettierrc, .prettierrc.js,,,).
You can turn on this behavior passing `--prettier` options to CLI.

## Remarks
### Available file types
This CLI can replace import declarations in the following file types:

- JavaScript: .js, .jsx, .mjs
- TypeScript: .ts, .tsx

And imports non-JavaScript files are allowed. For example:


```js
/* some.component.jsx */

import styles from './some.component.css';

// ...
```

However, non-JavaScript import(i.e. `@import` in CSS) could not be replaced.

## License
MIT. See LICENSE file under the this repository.
