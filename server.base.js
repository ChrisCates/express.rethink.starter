module.exports = (config) => {
  //API Dependencies
  const express = require('express')
  const app = express()
  const multer = require('multer')
  const bcrypt = require('bcryptjs')
  const async = require('async')
  const joi = require('joi')

  //RethinkDB
  const r = require('rethinkdbdash')()
  require('rethink-config')({
    'r': r,
    'database': 'starter',
    'tables': ['users'],
    'indexes': [
      {
        'table': 'users',
        'index': 'email'
      }
    ]
  }, (err) => {
    if (err) throw err
  })

  //Redis Token && Redis Auth
  const redis = require('redis.token')(config.redis, (err) => { if (err) throw err })
  const auth = require('redis.auth')(redis)

  //Setup body parser
  const bodyParser = require('body-parser')
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({'extended': true}))

  //Create dependency object for routes
  const deps = {
    'router': express.Router(),
    'multer': multer,
    'r': r,
    'redis': redis,
    'auth': auth,
    'bcrypt': bcrypt,
    'async': async,
    'joi': joi
  }

  /*********************
  ***** API Routes *****
  *********************/
  //User routes
  app.use(require('./api/post.user.register.js')(deps))
  app.use(require('./api/post.user.login.js')(deps))

  //Return the application content
  return {
    'app': app,
    'deps': deps
  }
}
