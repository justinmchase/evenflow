require('@babel/register')
require('source-map-support/register')
require('require-dir')('./tasks', { recurse: true })
