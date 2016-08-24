'use strict'

const Config = require('./config')
const Mongoose = require('mongoose')
Mongoose.Promise = require('bluebird')

module.exports = Mongoose.createConnection(Config.dbString.dev)
