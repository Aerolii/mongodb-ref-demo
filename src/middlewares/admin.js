function admin(req, res, next) {
  // 假设已通过认证
  if (!req.user.isAdmin) return res.status(403).send('Access denied.')

  next()
}

module.exports = admin
