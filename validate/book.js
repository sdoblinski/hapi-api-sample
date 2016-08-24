'use strict'

const Joi = require('joi')

module.exports = {
  payload: Joi.object({
    _id: Joi.string().min(24).max(50).optional(),
    title: Joi.string().min(1).max(50).required(),
    author: Joi.string().min(1).max(50).required(),
    isbn: Joi.number().optional()
  }).required().min(1)
}
