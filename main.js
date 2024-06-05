const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const readEnv = require('./src/config')

const {
  movies,
  customers,
  genres,
  rentals,
  users,
  login,
  auth
} = require('./src/controller')

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
      process.exit(1)
    })
}

function useMiddleware() {
  app.use(morgan('dev'))
  app.use(express.json())
  app.use(express.urlencoded())
  app.use('/api/movies', movies)
  app.use('/api/genres', genres)
  app.use('/api/customers', customers)
  app.use('/api/rentals', rentals)
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
}

function run() {
  const port = process.env.PORT || 3000

  app.listen(port, () => console.log(`Listening on port ${port}...`))
}

useMiddleware()
connectDB()

run()
