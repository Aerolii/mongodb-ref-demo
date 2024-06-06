const { Router } = require('express')
const bcrypt = require('bcrypt')
const pick = require('lodash.pick')
const { validateUser, User } = require('../models/users')
const auth = require('./../middlewares/auth')
const admin = require('./../middlewares/admin')
const asyncMiddleware = require('../middlewares/asyncMiddleware')

const router = Router()

/**
 * 获取用户详细信息
 * 这个接口是为了 防止 get('/:id') 的形式，泄漏用户 id
 *
 */
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-_id -id -password')
    if (!user) return res.status(400).send('User does not exist.')
    res.send(user)
  } catch (error) {
    res.status(400).send(error.message)
  }
  // try {
  //   const users = await User.find()
  //   res.json(users.map((user) => pick(user, ['name', 'email', 'id'])))
  //   // res.json({
  //   //   data: users.map((user) => user.toJSON())
  //   // })
  // } catch (error) {
  //   res.status(500).json({ message: error.message })
  // }
})

router.post('/', async (req, res) => {
  const { error, value } = validateUser(req.body)

  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  const { name, email, password } = value

  try {
    // 查询总是比写入切查询更快
    let user = await User.findOne({ email: email })
    if (user) return res.status(400).send('User already registered.')

    const salt = await bcrypt.genSalt(10)
    const pwd = await bcrypt.hash(password, salt)

    user = new User({
      name,
      email,
      password: pwd
    })

    user = await user.save()
    // const token = jwt.sign({ id: data._id }, process.env.EXPRESS_APP_JWT_KEY)
    // const token = generateToken(data._id)
    const token = user.generateAuthToken()
    res.header('x-auth-token', token).json(pick(user, ['name', 'email', 'id']))
  } catch (error) {
    res.status(500).json({ message: JSON.stringify(error.message) })
  }
})

router.get(
  '/all',
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const users = await User.find()
    res.send(users)
  })
)

module.exports = router
