//Get base server
const config = require('./config.' + process.env.NODE_ENV + '.json')
const base = require('./server.base.js')(config)
const app = base.app
const r = base.deps.r

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
  if (process.env.TESTING_ENV == 'true') {
    console.log('Testing mode so exiting')
    process.exit()
  }
})

const PORT = process.env.PORT || config.port

//Initialize server
app.listen(PORT)
console.log('Starter pack running on PORT', PORT)
