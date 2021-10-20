/* eslint no-global-assign: "error" */
/* global require:writable */
require = require('esm')(module, { cjs: { dedefault: true }, force: true })
module.exports = require('./main.js')
