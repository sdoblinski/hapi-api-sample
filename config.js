'use strict'

const Config = function () {}

Config.prototype.dbString = {
  dev: 'mongodb://172.17.0.2:27017/hapi-rest-mongo'
}

module.exports = new Config()
