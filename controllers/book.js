'use strict'

const Boom = require('boom')

module.exports = function (db) {
  const Book = require('../modelFactories/book')(db)
  const BookReadService = require('../services/book/bookRead')(Book)
  const BookWriteService = require('../services/book/bookWrite')(Book)
  const BookDeleteService = require('../services/book/bookDelete')(Book)

  const BookRead = new BookReadService()
  const BookWrite = new BookWriteService()
  const BookDelete = new BookDeleteService()

  const bookController = function () {}

  bookController.prototype.getAll = function (request, reply) {
    BookRead.get()
    .then((books) => {
      reply(books)
    })
    .catch((e) => {
      reply(Boom.wrap(e, 400))
    })
  }

  bookController.prototype.getById = function (request, reply) {
    BookRead.getById(request.params.id)
    .then((book) => {
      if (book) {
        reply(book)
      } else {
        reply(Boom.notFound())
      }
    })
    .catch((e) => {
      reply(Boom.wrap(e, 400))
    })
  }

  bookController.prototype.create = function (request, reply) {
    BookWrite.create(request.payload)
    .then((book) => {
      reply(book).code(201)
    })
    .catch((e) => {
      reply(Boom.wrap(e, 400))
    })
  }

  bookController.prototype.updateById = function (request, reply) {
    BookWrite.updateById(request.params.id, request.payload)
    .then((book) => {
      if (book) {
        reply(book)
      } else {
        reply(Boom.notFound())
      }
    })
    .catch((e) => {
      reply(Boom.wrap(e, 400))
    })
  }

  bookController.prototype.deleteById = function (request, reply) {
    BookDelete.deleteById(request.params.id)
    .then((res) => {
      if (!(res.result.ok === 1 && res.result.n === 1)) {
        reply(Boom.notFound())
      } else {
        reply('success')
      }
    })
    .catch((e) => {
      reply(Boom.wrap(e, 400))
    })
  }

  return bookController
}
