const jsonwebtoken = require('jsonwebtoken')

const secret = 'za'

const JWT = {
  generate(value, exprires) {
    return jsonwebtoken.sign(value, secret, { expiresIn: exprires })
  },
  verify(token) {
    try {
      return jsonwebtoken.verify(token, secret)
    } catch (e) {
      return false
    }
  }
}

module.exports = JWT
