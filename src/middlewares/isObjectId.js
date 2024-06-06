const { isObjectId } = require('../lib/utils')

function isObjectIdMiddleware(req, res, next) {
  console.log(req.params)
  if (req.params.id) {
    const isValid = isObjectId(req.params.id)
    console.log('isValid :>> ', isValid)
    if (!isValid) {
      return res.status(400).send('The parameters Id is invalid ObjectId')
    }
    next()
  } else {
    next()
  }
}

module.exports = isObjectIdMiddleware
