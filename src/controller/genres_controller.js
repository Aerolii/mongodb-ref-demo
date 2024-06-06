const { Router } = require('express')
const { Genre } = require('../models/genre')
const auth = require('./../middlewares/auth')
const admin = require('../middlewares/admin')
const isObjectIdMiddleware = require('../middlewares/isObjectId')

const router = Router()

router.use('/:id', isObjectIdMiddleware)

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

// delete
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const data = await Genre.findByIdAndDelete(req.params.id)
    res.send(data)
  } catch (error) {
    res.status(400).send(error.message)
  }
})
module.exports = router
