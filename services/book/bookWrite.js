'use strict'

module.exports = function (Book) {
  const BookWriteService = function () {}

  BookWriteService.prototype.create = function (payload) {
    return new Promise(function (resolve, reject) {
      const newBook = new Book()
      newBook.author = payload.author
      newBook.title = payload.title

      newBook.save()
      .then((book) => {
        resolve(book)
      })
      .catch((e) => {
        reject(e)
      })
    })
  }

  BookWriteService.prototype.updateById = function (id, payload) {
    return new Promise(function (resolve, reject) {
      Book.findOneAndUpdate({
        _id: id
      }, {
        $set: payload
      }, {
        new: true
      })
      .then((book) => {
        resolve(book)
      })
      .catch((e) => {
        reject(e)
      })
    })
  }
  return BookWriteService
}
