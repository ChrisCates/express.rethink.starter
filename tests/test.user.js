const config = require('../config.'+ (process.env.NODE_ENV || 'development') +'.json')
const request = require('supertest')
const base = require('../server.base.js')(config)
const app = base.app

const randomEmail = Math.random() + '@gmail.com'
const randomPassword = Math.random().toString()
const grantType = 'user'

describe('/user API', () => {

  describe('POST /user/register', () => {

    it('Should return a new user', (done) => {
      request(app)
      .post('/user/register')
      .set('Accept', 'application/json')
      .send({
        'email': randomEmail,
        'password': randomPassword,
        'grantType': grantType
      })
      .expect(200)
      .end((err,res) => {
        if (err) { throw err } else { done() }
      })
    })

    it('Should say user already exists', (done) => {
      request(app)
      .post('/user/register')
      .set('Accept', 'application/json')
      .send({
        'email': randomEmail,
        'password': randomPassword,
        'grantType': grantType
      })
      .expect(500)
      .end((err,res) => {
        if (err) { throw err } else { done() }
      })
    })
  })

  describe('POST /user/login', () => {
    it('Should login the user successfully', () => {
      request(app)
      .post('/user/login')
      .set('Accept', 'application/json')
      .send({
        'email': randomEmail,
        'password': randomPassword,
        'grantType': grantType
      })
      .expect(200)
      .end((err,res) => {
        if (err) { throw err } else { done() }
      })
    })

    it('Should say incorrect password...', (done) => {
      request(app)
      .post('/user/login')
      .set('Accept', 'application/json')
      .send({
        'email': randomEmail,
        'password': randomPassword + 1,
        'grantType': grantType
      })
      .expect(500)
      .end((err,res) => {
        if (err) { throw err } else { done() }
      })
    })

    it('Should say user does not exist...', (done) => {
      request(app)
      .post('/user/login')
      .set('Accept', 'application/json')
      .send({
        'email': randomEmail + 1,
        'password': randomPassword + 1,
        'grantType': grantType
      })
      .expect(500)
      .end((err,res) => {
        if (err) { throw err } else { done() }
      })
    })

  })

})
