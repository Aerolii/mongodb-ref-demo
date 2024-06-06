const { Router } = require('express')
const { validate, Movie } = require('../models/movie')
const { Genre } = require('../models/genre')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const asyncMiddleware = require('../middlewares/asyncMiddleware')

const router = Router()

router.route('/').post(auth)
router.route('/:id').put(auth).post(auth).delete([auth, admin])

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

    let movie = new Movie({
      title,
      numberInStock,
      dailyRateRental,
      genres: genres.map(({ _id, name }) => ({ _id, name }))
    })
    // 实际上， ObjectId 是 mongodb driver 生成而不是 mongodb
    // 所以在连接时，driver 就已经生成了 ObjectId
    // 不再需要去写入返回数据
    await movie.save()
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

router.delete(
  '/:id',
  asyncMiddleware(async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id)
    console.log('movie :>> ', movie)
    if (movie) {
      res.send(movie)
    } else {
      throw new Error(`Not founded Movie with movie ID ${req.params.id}`)
    }
  })
)

module.exports = router
