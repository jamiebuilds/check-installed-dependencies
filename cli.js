#!/usr/bin/env node

'use strict';

var meow = require('meow');
var pkgDir = require('pkg-dir');
var checkInstalledDependencies = require('./');

meow([
  'Usage',
  '  $ check-installed-dependencies'
]);

var directory = pkgDir.sync(process.cwd());

checkInstalledDependencies(directory, function(err, mismatches) {
  if (err) {
    console.error(err);
    process.exit(1);
  } else if (!mismatches.length) {
    process.exit(0);
  } else {
    console.log(mismatches.map(function(mismatch) {
      var name = mismatch.name;
      var current = mismatch.current;
      var requested = mismatch.requested;
      if (!current) {
        return name + ' is not installed';
      } else {
        return name + ' is outdated (' + current + ' does not satisify ' + requested + ')';
      }
    }).join('\n'));
    process.exit(1);
  }
});
