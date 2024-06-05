const { Router } = require('express')
const { Genre } = require('../models/genre')
const auth = require('./../middlewares/auth')

const router = Router()

router.get('/', async (req, res) => {
  const genres = await Genre.find()
  res.send(genres)
})

router.post('/', auth, (req, res) => {
  res.send('create a genre')
})

router.get('/:id', (req, res) => {
  res.send(`get a genre with ID ${req.params.id}`)
})

// update
router.put('/:id', auth, (req, res) => {
  res.send(`update genre with ID ${req.params.id}`)
})

module.exports = router
