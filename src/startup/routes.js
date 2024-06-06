const express = require('express')

const {
  movies,
  customers,
  genres,
  rentals,
  users,
  login,
  auth
} = require('../controller')

const errorMiddleware = require('../middlewares/error')
const authMiddleware = require('../middlewares/auth')
const adminMiddleware = require('../middlewares/admin')

function routes(app) {
  app.use(express.urlencoded())
  app.use(express.json())

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

module.exports = routes
