const jwt = require('jsonwebtoken')

function auth(req, res, next) {
  const token = req.header('x-auth-token')
  if (!token) return res.status(401).send('Access denied. No token provied.')

  try {
    const decode = jwt.verify(token, process.env.EXPRESS_APP_JWT_KEY)
    req.user = decode
    next()
  } catch (error) {
    res.status(400).send('Invalid Token.')
  }
}

module.exports = auth
