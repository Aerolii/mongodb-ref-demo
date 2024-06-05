const { Router } = require('express')
const bcrypt = require('bcrypt')
const pick = require('lodash.pick')
const generateToken = require('./../lib/token')
const { validateUser, User } = require('../models/users')

const router = Router()

router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users.map((user) => pick(user, ['name', 'email', 'id'])))
    // res.json({
    //   data: users.map((user) => user.toJSON())
    // })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
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

    const data = await user.save()
    // const token = jwt.sign({ id: data._id }, process.env.EXPRESS_APP_JWT_KEY)
    const token = generateToken(data._id)

    res.header('x-auth-token', token).json(pick(data, ['name', 'email', 'id']))
  } catch (error) {
    res.status(500).json({ message: JSON.stringify(error.message) })
  }
})

module.exports = router
