'use strict'

const bookSchema = require('../validate/book')

exports.register = function (server, options, next) {
  const BookController = require('../controllers/book')(server.app.db)
  const bookController = new BookController()
  server.bind(bookController)

  server.route({
    method: 'GET',
    path: '/books',
    handler: bookController.getAll
  })

  server.route({
    method: 'GET',
    path: '/books/{id}',
    handler: bookController.getById
  })

  server.route({
    method: 'POST',
    path: '/books',
    handler: bookController.create,
    config: {
      validate: bookSchema
    }
  })

  server.route({
    method: 'PATCH',
    path: '/books/{id}',
    handler: bookController.updateById,
    config: {
      validate: bookSchema
    }
  })

  server.route({
    method: 'DELETE',
    path: '/books/{id}',
    handler: bookController.deleteById
  })

  return next()
}

exports.register.attributes = {
  name: 'routes-books'
}
