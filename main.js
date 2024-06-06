const express = require('express')
const morgan = require('morgan')
const winston = require('winston')

const app = express()
require('./src/config')(app.get('env'))
require('./src/startup/routes')(app)
require('./src/startup/db')(app)

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'log/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'log/combined.log' }),
    new winston.transports.Http({
      level: 'info',
      filename: 'log/http.log'
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'log/exceptions.log' })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'log/rejections.log' })
  ]
})
logger.http(
  'http-error',
  new winston.transports.Http({
    level: 'info',
    filename: 'log/http.log'
  })
)

// Promise.reject('aaa').then()
// throw new Error('aaa')

// new winston.ExceptionHandler(logger)
// new winston.RejectionHandler((err) => logger(err))

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  )
}

// process.on('unhandledRejection', (err) => logger.error(err))

function useMiddleware() {
  app.use(morgan('dev'))
}

function run() {
  const port = process.env.PORT || 3000

  app.listen(port, () => console.log(`Listening on port ${port}...`))
}

useMiddleware()
run()

// Promise.reject('something wrong').then()
