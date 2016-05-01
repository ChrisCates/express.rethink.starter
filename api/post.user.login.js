module.exports = (deps) => {

  //Server dependencies
  const router = deps.router
  const r = deps.r
  const bcrypt = deps.bcrypt
  const async = deps.async
  const joi = deps.joi
  const redis = deps.redis

  //Initialize route
  router.post('/user/login', (req,res) => {

    async.series(
      [
        //Validation
        (callback) => {
          joi.validate(
            {
              'email': req.body.email,
              'password': req.body.password,
              'grantType': req.body.grantType
            },
            joi.object().keys({
              'email': joi.string().min(3).max(100),
              'password': joi.string().min(5).max(100),
              'grantType': joi.string().min(4).max(10)
            }),
            (err) => {
              if (err) return callback(err)
              callback()
            }
          )
        },
        //Check if email already exists
        (callback) => {
          r.db('starter').table('users')
          .getAll(req.body.email, {'index': 'email'})
          .then( (User) => {
            if (User.length > 0) {
              User = User[0]
              if (bcrypt.compareSync(req.body.password, User.password)) {
                //Store a token
                redis.generate(
                  {
                    'id': User.id,
                    'email': User.email
                  },
                  (err, result) => {
                    if (err) callback(err)
                    return res.status(200).send({
                      'status': 200,
                      'message': req.body.email + ' logged in as ' + req.body.grantType,
                      'token': result.token
                    })
                  }
                )
              } else {
                return res.status(500).send({
                  'status': 500,
                  'message': 'Your password was incorrect...'
                })
              }
            } else {
              return res.status(500).send({
                'status': 500,
                'message': 'User does not exist...'
              })
            }
          })
        }
      ],
      //Send result message if there is an error
      (err) => {
        return res.status(500).send({
          'status': 500,
          'message': err
        })
      }
    )

  })

  return router
}
