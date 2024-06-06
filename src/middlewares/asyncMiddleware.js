/**
 * 异步操作异常捕获中间件
 */
function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next)
    } catch (error) {
      console.log('error :>> ', error)
      next(error)
    }
  }
}

module.exports = asyncMiddleware
