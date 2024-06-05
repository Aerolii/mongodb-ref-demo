const { Router } = require('express')
const { validate, Movie } = require('../models/movie')
const { Genre } = require('../models/genre')

const router = Router()

router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find()
    res.send(movies)
  } catch (error) {
    res.status(404).send('Not Founded Movies.')
  }
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)

  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  try {
    const { genresId, title, numberInStock, dailyRateRental } = req.body
    /**
     * 查找所有匹配的 genres
     */
    const genres = await Promise.all(genresId.map((id) => Genre.findById(id)))

    if (!genres.length) return res.status(400).send('Not found genre with ID.')
    console.log('genres :>> ', genres)
    let movie = new Movie({
      title,
      numberInStock,
      dailyRateRental,
      genres: genres.map(({ _id, name }) => ({ _id, name }))
    })
    movie = await movie.save()
    res.send(movie)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
router.get('/:id', (req, res) => {
  res.send(`get a movie with ID ${req.params.id}`)
})

// update
router.put('/:id', (req, res) => {
  res.send(`update movie with ID ${req.params.id}`)
})

module.exports = router
