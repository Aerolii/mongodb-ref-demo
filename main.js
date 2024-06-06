const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const readEnv = require('./src/config')
const authMiddleware = require('./src/middlewares/auth')
const adminMiddleware = require('./src/middlewares/admin')
const winston = require('winston')

const {
  movies,
  customers,
  genres,
  rentals,
  users,
  login,
  auth
} = require('./src/controller')
const errorMiddleware = require('./src/middlewares/error')

const app = express()

// 程序启动就加载 env
readEnv(app.get('env'))

function connectDB() {
  if (!process.env.EXPRESS_APP_DB) {
    console.error(
      'Environment Variables Error: Not found the variable EXPRESS_APP_DB, that connect to DB url.'
    )
    process.exit(1)
  }
  const mongoDB = process.env.EXPRESS_APP_DB
  mongoose
    .connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log('Connected to MongoDB')
    })
    .catch((err) => {
      console.log('Could not connect to MongoDB: ', err)
      // 长时间未连接 mongodb 连接可能释放，从而导致连接失败
      // 当发生 Promise Reject 时， 如果未进行处理，那么 Node 可能终止当前程序运行的 process
      // process.exit(1)
    })
}

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
  app.use(express.json())
  app.use(express.urlencoded())

  // /**
  //  * 自定义 Authentication 用户认证中间件
  //  */
  // app.use(function (req, res, next) {
  //   const token = req.header('x-auth-token')
  //   console.log(req.method)
  //   console.log('req.path :>> ', req.path)
  //   if (!token) return res.status(401).send('Access denied. No token provied.')
  // })

  app.use('/api/movies', movies)
  app.use('/api/genres', genres)
  app.use('/api/customers', authMiddleware, adminMiddleware, customers)
  app.use('/api/rentals', [authMiddleware, adminMiddleware], rentals)
  // 两种方式设置路由
  // // 注册
  // app.post('/api/users', (req, res) => {
  //   res.send('Request Register a User')
  // })

  // // 登陆
  // //
  // app.use(
  //   '/api/login',
  //   express.Router().post('/', (req, res) => {
  //     res.send('Request Login use User Info')
  //   })
  // )

  app.use('/api/users', users)
  app.use('/api/login', login)
  app.use('/api/auth', auth)

  // app.use('/api/test', test)

  app.use(errorMiddleware)
}

function run() {
  const port = process.env.PORT || 3000

  app.listen(port, () => console.log(`Listening on port ${port}...`))
}

useMiddleware()
connectDB()
run()

// Promise.reject('something wrong').then()
