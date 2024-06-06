/**
 * 认证用户
 */

const { Router } = require('express')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const { User } = require('../models/users')

const router = Router()

// 认证
router.post('/', async (req, res) => {
  const { error, value } = validate(req.body)

  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  const { email, password } = req.body

  try {
    // 校验用户是否存在
    const user = await User.findOne({ email: email })
    if (!user) return res.status(400).send('Invalid email or password!')
    // user.toJSON({ getters: false })

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword)
      return res.status(400).send('Invalid email or password!')
    // const token = jwt.sign({ id: user._id }, process.env.EXPRESS_APP_JWT_KEY)
    res.send(user.generateAuthToken())
  } catch (error) {
    res.status(500).json({ message: JSON.stringify(error.message) })
  }
})

function validate({ email, password }) {
  const schema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,18}$')).required()
  })

  return schema.validate({ email, password })
}

module.exports = router
