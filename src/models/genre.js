const Joi = require('joi')
const { default: mongoose, Schema, model } = require('mongoose')

const genreSchema = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 50,
    required: true
  }
})

const Genre = model('Genre', genreSchema)

function validate(name) {
  const schema = JoiExtended.object({
    name: Joi.string().min(2).max(50).required()
  })

  return schema.validate({ name })
}

module.exports = {
  genreSchema,
  Genre,
  validate
}
