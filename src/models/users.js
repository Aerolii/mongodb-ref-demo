const Joi = require('joi')
const { default: mongoose, Schema, model } = require('mongoose')
const { randomUUID } = require('node:crypto')
const jwt = require('jsonwebtoken')

// const userSchema = new Schema(
//   {
//     email: {
//       type: String,
//       get: obfuscate
//     }
//   },
//   { toJSON: { getters: true } }
// )

// // Or, globally
// mongoose.set('toJSON', { getters: true })

// // Or, on a one-off basis
// app.get(function (req, res) {
//   return (
//     User.findOne()
//       // The `email` getter will run here
//       .then((doc) => res.json(doc.toJSON({ getters: true })))
//       .catch((err) => res.status(500).json({ message: err.message }))
//   )
// })

const userSchema = new Schema(
  {
    _id: { type: Schema.Types.UUID, default: () => randomUUID() },
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 2,
      maxlength: 50
    },

    email: {
      type: String,
      unique: true,
      required: true,
      get: (email) => {
        const separatorIndex = email.indexOf('@')
        if (separatorIndex < 6) {
          // 'ab@gmail.com' -> '**@gmail.com'
          return (
            email.slice(0, separatorIndex).replace(/./g, '*') +
            email.slice(separatorIndex)
          )
        }
        // 'test42@gmail.com' -> 'te**42@gmail.com'
        return (
          email.slice(0, 2) +
          email.slice(2, separatorIndex - 2).replace(/./g, '*') +
          email.slice(separatorIndex - 2, separatorIndex) +
          email.slice(separatorIndex)
        )
      }
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 1024, // hash 化密码
      required: true
      // get: (pwd) => {
      //   const len = pwd.length
      //   return (
      //     pwd.slice(0, 2) +
      //     pwd.slice(2, len - 2).replace(/./g, '*') +
      //     pwd.slice(len - 2)
      //   )
      // }
    }
  },
  { toJSON: { getters: true } }
)

// userSchema.method('generateAuthToken', function () {
//   return jwt.sign({ id: this._id }, process.env.EXPRESS_APP_JWT_KEY)
// })
userSchema.methods = {
  generateAuthToken: function () {
    return jwt.sign({ id: this._id }, process.env.EXPRESS_APP_JWT_KEY)
  }
}

// // 添加自定义方法
// userSchema.methods.generateAuthToken = function () {
//   return jwt.sign({ id: this._id }, process.env.EXPRESS_APP_JWT_KEY)
// }

const User = model('User', userSchema)

function validateUser({ name, email, password }) {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,18}$'))
  })

  return schema.validate({ name, email, password })
}

module.exports = {
  userSchema,
  User,
  validateUser
}
