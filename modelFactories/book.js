'use strict'

const Mongoose = require('mongoose')
const bookSchema = require('../schemas/book')

module.exports = function (db) {
  return db.model('Book', new Mongoose.Schema(bookSchema))
}
