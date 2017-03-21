/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the same BSD-style license found in the
 * LICENSE file in the root directory of this source tree and in the
 * https://github.com/facebook/fbjs repository. An additional grant of patent
 * rights can be found in the PATENTS file in the fbjs repository.
 */

'use strict';

var readPackageJson = require('read-package-json');
var startsWith = require('lodash.startswith');
var semver = require('semver');
var spawn = require('cross-spawn');
var path = require('path');

function getOutdatedData(cwd, cb) {
  var outdated = spawn(
    'npm',
    ['outdated', '--json', '--long'],
    { cwd: cwd }
  );

  var data = '';

  outdated.stdout.on('data', function(chunk) {
    data += chunk.toString();
  });

  outdated.on('exit', function(code) {
    try {
      cb(null, data ? JSON.parse(data) : {});
    } catch (err) {
      cb(new Error('`npm outdated --json --long` output invalid JSON. stdout: \n\n' + data));
    }
  });
}

function getMismatches(pkgData, outdatedData) {
  var mismatches = [];

  Object.keys(outdatedData).forEach(function(name) {
    var current = outdatedData[name].current;
    var type = outdatedData[name].type;
    var requested = pkgData[type][name];

    if (
      !startsWith(requested, 'file:') &&
      !startsWith(requested, 'github:') &&
      !semver.satisfies(current, requested)
    ) {
      mismatches.push({
        name: name,
        current: current,
        requested: requested
      });
    }
  });

  return mismatches;
}

module.exports = function checkInstalledDependencies(cwd, cb) {
  readPackageJson(path.join(cwd, 'package.json'), function(err, pkgData) {
    if (err) return cb(err);
    getOutdatedData(cwd, function(err, outdatedData) {
      if (err) return cb(err);
      cb(null, getMismatches(pkgData, outdatedData));
    });
  });
};
