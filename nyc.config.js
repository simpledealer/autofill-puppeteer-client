'use strict'
const isWindows = require('is-windows')()
module.exports = {
  exclude: [
    'coverage/*',
    '**/*.spec.js'
  ],
  /* Unknown why we don't get 100% coverage on Windows. */
  'check-coverage': !isWindows,
  branches: 10,
  functions: 10,
  lines: 10,
  statements: 10
}
