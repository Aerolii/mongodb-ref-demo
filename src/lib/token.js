const jwt = require('jsonwebtoken')

/**
 *
 * @param string id
 * 用户唯一ID
 *
 * @returns string
 * 返回 token 字符串
 */
function generateToken(id) {
  return jwt.sign({ id }, process.env.EXPRESS_APP_JWT_KEY)
}

module.exports = {
  generateToken
}
