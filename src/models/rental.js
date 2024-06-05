const Joi = require('joi')
const { required } = require('joi')
const { Schema, model } = require('mongoose')

const rentalSchema = new Schema({
  customer: {
    type: new Schema({
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
      }
    }),
    required: true
  },
  movie: {
    type: new Schema({
      title: {
        type: String,
        minlength: 2,
        maxlength: 50,
        required: true
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
      }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  // 归还时设置归还日期并计算费用
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
})

const Rental = model('Rental', rentalSchema)

function validate({ customerId, movieId }) {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required()
  })

  return schema.validate({ customerId, movieId })
}

module.exports = {
  rentalSchema,
  Rental,
  validate
}
