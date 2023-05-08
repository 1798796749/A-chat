// 跨域
const cors = require('cors')
const { expressjwt } = require('express-jwt')
const secretKEY = 'za'

module.exports = [
  cors(),
  expressjwt({ secret: secretKEY, algorithms: ['HS256'] }).unless({
    path: [
      '/login',
      '/registuser',
      { url: /^\/avataruploads\/.*/, methods: ['GET'] },
      { url: /^\/videos\/.*/, methods: ['GET'] },
      { url: /^\/imgs\/.*/, methods: ['GET'] }
    ]
  })
]
