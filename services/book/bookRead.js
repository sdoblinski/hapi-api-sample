'use strict'

module.exports = function (Book) {
  const BookReadService = function () {}

  BookReadService.prototype.get = function () {
    return new Promise(function (resolve, reject) {
      Book.find()
      .then((books) => {
        resolve(books)
      })
      .catch((e) => {
        reject(e)
      })
    })
  }

  BookReadService.prototype.getById = function (id) {
    return new Promise(function (resolve, reject) {
      Book.findOne({
        _id: id
      })
      .then((book) => {
        resolve(book)
      })
      .catch((e) => {
        reject(e)
      })
    })
  }
  return BookReadService
}
