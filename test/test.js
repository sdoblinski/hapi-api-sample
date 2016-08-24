/* eslint-env lab */
'use strict'

const lab = exports.lab = require('lab').script()
const expect = require('chai').expect
const it = lab.it
const describe = lab.describe
const before = lab.before

const proxyquire = require('proxyquire')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const mockgoose = require('mockgoose')
let server

describe('GET /books', () => {
  before((done) => {
    mockgoose(mongoose).then(() => {
      mongoose.connect('mock')
      .then(() => {
        server = proxyquire('../index', { './db': mongoose })
        done()
      })
      .catch((e) => {
        throw e
      })
    })
  })

  it('retorna status 200', (done) => {
    const options = {
      method: 'GET',
      url: '/books'
    }
    server.inject(options, (res) => {
      expect(res).to.have.property('statusCode', 200)
      done()
    })
  })

  it('retorna array vazio quando se não há livros', (done) => {
    const options = {
      method: 'GET',
      url: '/books'
    }
    server.inject(options, (res) => {
      expect(res.result).to.have.length.at.least(0)
      done()
    })
  })

  it('retorna livros cadastrados', (done) => {
    const options = {
      method: 'POST',
      url: '/books',
      payload: {
        author: 'Platão',
        title: 'Protágoras'
      }
    }
    server.inject(options, (res) => {
      const options = {
        method: 'GET',
        url: '/books'
      }
      server.inject(options, (res) => {
        expect(res).to.have.property('result')
        expect(res.result).to.have.length.at.least(1)
        expect(res.result[0]).to.have.property('author')
        expect(res.result[0]).to.have.property('title')
        done()
      })
    })
  })
})

describe('GET /books{id}', () => {
  let _id
  before((done) => {
    const options = {
      method: 'POST',
      url: '/books',
      payload: {
        author: 'Aristóteles',
        title: 'Metafísica'
      }
    }
    server.inject(options, (res) => {
      _id = res.result._id
      done()
    })
  })
  it('retorna status 200', (done) => {
    const options = {
      method: 'POST',
      url: '/books',
      payload: {
        author: 'Platão',
        title: 'Protágoras'
      }
    }
    server.inject(options, (res) => {
      const options = {
        method: 'GET',
        url: '/books/' + res.result._id
      }
      server.inject(options, (res) => {
        expect(res).to.have.property('statusCode', 200)
        done()
      })
    })
  })

  it('retorna status 400 se o id for inválido', (done) => {
    const options = {
      method: 'GET',
      url: '/books/123'
    }
    server.inject(options, (res) => {
      expect(res).to.have.property('statusCode', 400)
      done()
    })
  })

  it('retorna status 404 se o id válido não existir', (done) => {
    const options = {
      method: 'GET',
      url: '/books/123456789012345678901234'
    }
    server.inject(options, (res) => {
      expect(res).to.have.property('statusCode', 404)
      done()
    })
  })

  it('retorna livros cadastrados', (done) => {
    const options = {
      method: 'GET',
      url: '/books/' + _id
    }
    server.inject(options, (res) => {
      expect(res).to.have.property('result')
      expect(res.result).to.have.property('author')
      expect(res.result).to.have.property('title')
      done()
    })
  })
})

describe('POST /books', () => {
  it('retorna status 400 quando req não tem corpo', (done) => {
    const options = {
      method: 'POST',
      url: '/books'
    }
    server.inject(options, (res) => {
      expect(res).to.have.property('statusCode', 400)
      done()
    })
  })

  it('retorna status 201 quando os dados estão corretos', (done) => {
    const options = {
      method: 'POST',
      url: '/books',
      payload: {
        author: 'Aristóteles',
        title: 'Metafísica'
      }
    }
    server.inject(options, (res) => {
      expect(res).to.have.property('statusCode', 201)
      done()
    })
  })

  it('retorna status 400 quando author não é enviado', (done) => {
    const options = {
      method: 'POST',
      url: '/books',
      payload: {
        title: 'Metafísica'
      }
    }
    server.inject(options, (res) => {
      expect(res).to.have.property('statusCode', 400)
      done()
    })
  })

  it('retorna status 400 quando title não é enviado', (done) => {
    const options = {
      method: 'POST',
      url: '/books',
      payload: {
        author: 'Aristóteles'
      }
    }
    server.inject(options, (res) => {
      expect(res).to.have.property('statusCode', 400)
      done()
    })
  })

  it('retorna status 400 quando autor tem mais que 100 caracteres', (done) => {
    const options = {
      method: 'POST',
      url: '/books',
      payload: {
        author: 'AristótelesAristótelesAristótelesAristótelesAristótelesAristótelesAristótelesAristótelesAristótelesAristótelesAristótelesAristótelesAristóteles',
        title: 'Metafísica'
      }
    }
    server.inject(options, (res) => {
      expect(res).to.have.property('statusCode', 400)
      done()
    })
  })

  it('retorna status 400 quando title tem mais que 100 caracteres', (done) => {
    const options = {
      method: 'POST',
      url: '/books',
      payload: {
        author: 'Aristóteles',
        title: 'MetafísicaMetafísicaMetafísicaMetafísicaMetafísicaMetafísicaMetafísicaMetafísicaMetafísicaMetafísicaMetafísicaMetafísicaMetafísica'
      }
    }
    server.inject(options, (res) => {
      expect(res).to.have.property('statusCode', 400)
      done()
    })
  })
})

describe('PATCH /books', () => {
  let _id
  before((done) => {
    const options = {
      method: 'POST',
      url: '/books',
      payload: {
        author: 'Aristóteles',
        title: 'Metafísica'
      }
    }
    server.inject(options, (res) => {
      _id = res.result._id
      done()
    })
  })

  it('retorna status 400 quando req não tem corpo', (done) => {
    const options = {
      method: 'PATCH',
      url: '/books/' + _id
    }
    server.inject(options, (res) => {
      expect(res).to.have.property('statusCode', 400)
      done()
    })
  })

  it('retorna dados atualizados se foi persistido corretamente', (done) => {
    const options = {
      method: 'PATCH',
      url: '/books/' + _id,
      payload: {
        author: 'Aristóteles',
        title: 'Metafísica'
      }
    }
    server.inject(options, (res) => {
      expect(res).to.have.property('result')
      expect(res.result).to.have.property('author')
      expect(res.result.author).to.contain('Aristóteles')
      expect(res.result).to.have.property('title')
      expect(res.result.title).to.contain('Metafísica')
      done()
    })
  })

  it('retorna status 400 quando author não é enviado', (done) => {
    const options = {
      method: 'PATCH',
      url: '/books/' + _id,
      payload: {
        title: 'Metafísica'
      }
    }
    server.inject(options, (res) => {
      expect(res).to.have.property('statusCode', 400)
      done()
    })
  })

  it('retorna status 400 quando title não é enviado', (done) => {
    const options = {
      method: 'PATCH',
      url: '/books/' + _id,
      payload: {
        author: 'Aristóteles'
      }
    }
    server.inject(options, (res) => {
      expect(res).to.have.property('statusCode', 400)
      done()
    })
  })

  it('retorna status 400 quando autor tem mais que 100 caracteres', (done) => {
    const options = {
      method: 'PATCH',
      url: '/books/' + _id,
      payload: {
        author: 'AristótelesAristótelesAristótelesAristótelesAristótelesAristótelesAristótelesAristótelesAristótelesAristótelesAristótelesAristótelesAristóteles',
        title: 'Metafísica'
      }
    }
    server.inject(options, (res) => {
      expect(res).to.have.property('statusCode', 400)
      done()
    })
  })

  it('retorna status 400 quando title tem mais que 100 caracteres', (done) => {
    const options = {
      method: 'PATCH',
      url: '/books/' + _id,
      payload: {
        author: 'Aristóteles',
        title: 'MetafísicaMetafísicaMetafísicaMetafísicaMetafísicaMetafísicaMetafísicaMetafísicaMetafísicaMetafísicaMetafísicaMetafísicaMetafísica'
      }
    }
    server.inject(options, (res) => {
      expect(res).to.have.property('statusCode', 400)
      done()
    })
  })
})

describe('DELETE /books', () => {
  let _id
  before((done) => {
    const options = {
      method: 'POST',
      url: '/books',
      payload: {
        author: 'Aristóteles',
        title: 'Metafísica'
      }
    }
    server.inject(options, (res) => {
      _id = res.result._id
      done()
    })
  })

  it('retorna status 400 quando id não é enviado', (done) => {
    const options = {
      method: 'DELETE',
      url: '/books/1'
    }
    server.inject(options, (res) => {
      expect(res).to.have.property('statusCode', 400)
      done()
    })
  })

  it('retorna status 404 quando id não é encontrado', (done) => {
    const options = {
      method: 'DELETE',
      url: '/books/123456789012345678901234'
    }
    server.inject(options, (res) => {
      expect(res).to.have.property('statusCode', 404)
      done()
    })
  })

  it('retorna status 200 se livro é deletado', (done) => {
    const options = {
      method: 'DELETE',
      url: '/books/' + _id
    }
    server.inject(options, (res) => {
      expect(res).to.have.property('statusCode', 200)
      done()
    })
  })
})
