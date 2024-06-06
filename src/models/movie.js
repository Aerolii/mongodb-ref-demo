const Joi = require('joi')
const { Schema, model, default: mongoose } = require('mongoose')
const { genreSchema } = require('./genre')
const { isObjectId, JoiExtended } = require('../lib/utils')

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true
  },
  genres: {
    type: [genreSchema],
    required: true,
    validate: {
      validator: (v) => v.length > 0 && v.every((i) => isObjectId(i)),
      message: 'Genres should not empty array'
    }
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0
  },
  dailyRateRental: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
})

const Movie = model('Movie', movieSchema)

function validate(movie) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(50).required(),
    genresId: Joi.array().items(JoiExtended.isObjectId()).required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRateRental: Joi.number().min(0).required()
  })

  return schema.validate(movie)
}

module.exports = {
  Movie,
  movieSchema,
  validate
}
