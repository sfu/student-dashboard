#!/usr/bin/env node
require('babel-register')
require('babel-polyfill')
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production'

if (__DEVELOPMENT__) {
  process.env.DEBUG = 'express:*'
  if (!require('piping')({
      hook: true,
      ignore: /(\/\.|~$|\.json|\.scss$)/i
    })) {
    return
  }
}
require('../src/server')
