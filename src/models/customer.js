const Joi = require('joi')
const { default: mongoose, Schema, model } = require('mongoose')

const customerSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },

  isGold: {
    type: Boolean,
    default: false
  },

  phone: {
    type: String,
    required: true
  },

  address: {
    type: String
  }
})

const Customer = model('Customer', customerSchema)

function validate(customer) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    isGold: Joi.boolean(),
    phone: Joi.string().min(9).max(11).required(),
    address: Joi.string()
  })

  return schema.validate(customer)
}

module.exports = {
  customerSchema,
  Customer,
  validate
}
