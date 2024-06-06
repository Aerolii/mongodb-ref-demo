/**
 * 错误处理中间件
 */
function errorMiddleware(err, req, res, next) {
  if (err) {
    res.status(500).send(err.message)
  } else {
    next()
  }
}

module.exports = errorMiddleware
