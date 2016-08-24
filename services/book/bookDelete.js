'use strict'

module.exports = function (Book) {
  const BookDeleteService = function () {}

  BookDeleteService.prototype.deleteById = function (id) {
    return new Promise(function (resolve, reject) {
      Book.remove({
        _id: id
      })
      .then((res) => {
        resolve(res)
      })
      .catch((e) => {
        reject(e)
      })
    })
  }
  return BookDeleteService
}
