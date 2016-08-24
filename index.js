'use strict'

const Hapi = require('hapi')
const db = require('./db')
const bookRoutes = require('./routes/books')

const server = new Hapi.Server()
server.app.db = db

server.connection({
  port: 3000
})

server.register([bookRoutes],
(err) => {
  if (err) {
    throw err
  }

  server.start((err) => {
    if (err) {
      throw err
    }
    console.log('Server running at:', server.info.uri)
  })
})

module.exports = server
