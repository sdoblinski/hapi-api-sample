'use strict'

module.exports = {
  title: {
    type: String,
    min: 1,
    max: 100,
    required: true
  },
  author: {
    type: String,
    min: 1,
    max: 100,
    required: true
  },
  isbn: {
    type: Number,
    min: 9,
    max: 13
  }
}
