# check-installed-dependencies

> Check if the currently installed packages match package.json

(Based on the `check-dependencies.js` in [fbjs](https://github.com/facebook/fbjs/blob/71392a58a2cbac228ffd535e9ebd7072a20acb73/scripts/gulp/check-dependencies.js))

## Install

```sh
$ npm install --global check-installed-dependencies
```

## Usage

```sh
$ check-installed-dependencies
package-a is not installed
package-b is outdated (1.2.3 does not satisify ^2.0.0)
```

```js
var checkInstalledDependencies = require('check-installed-dependencies');

checkInstalledDependencies(packageDirectory, function(err, mismatches) {
  console.log(mismatches);
  // [{
  //   name: 'package-a',
  //   current: undefined,
  //   requested: '^1.0.0'
  // }, {
  //   name: 'package-b',
  //   current: '1.2.3',
  //   requested: '^2.0.0'
  // }]
});
```

> Note: This module currently doesn't support "file:" or "github:" versions.

## Usage in npm scripts

You can use `check-installed-dependencies` inside npm scripts.

```sh
$ npm install --save-dev check-installed-dependencies
```

Then in either `prepublish` or another npm script you can use
`check-installed-dependencies`.

```json
"scripts": {
  "prepublish": "check-installed-dependencies",
  "test": "check-installed-dependencies && mocha"
}
```

> Note: Using `check-installed-dependencies` in `prepublish` will stop the
> package from being published.
