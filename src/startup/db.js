const winston = require('winston')
const mongoose = require('mongoose')

function db() {
  const mongoDB = process.env.EXPRESS_APP_DB
  mongoose
    .connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      winston.info('Connected MongoDB...')
    })
}

module.exports = db
