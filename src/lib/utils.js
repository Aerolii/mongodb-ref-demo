const { default: mongoose } = require('mongoose')
const Joi = require('joi')

const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

const JoiExtended = Joi.extend((joi) => {
  return {
    type: 'isObjectId',
    base: joi.string().min(1).max(255).required(),
    messages: {
      'isObjectId.base': '{{#label}} must be a valid ObjectId'
    },
    validate(value, helpers) {
      if (!isObjectId(value)) {
        return { value, errors: helpers.error('isObjectId.base') }
      }
    }
  }
})

const runtimeErrorHandler = () => {
  // process.on('ReferenceError')
}

module.exports = {
  isObjectId,
  JoiExtended
}
