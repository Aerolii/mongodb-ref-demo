const { Router } = require('express')
const { default: mongoose, Schema, model, mongo } = require('mongoose')

const Test = model(
  'Test',
  new Schema(
    {
      id: {
        type: Schema.Types.ObjectId,
        get: function () {
          return this._id
        }
      },
      name: {
        type: String,
        required: true
      }
    },
    { toJSON: { getters: true } }
  )
)

const router = Router()

router.get('/', async (req, res) => {
  const datas = await Test.find()
  res.json(datas)
})

router.post('/', async (req, res) => {
  const data = new Test({
    name: req.body.name || 'abc'
  })
  try {
    console.log('data :>> ', data)
    const op = await data.save()
    res.send(op)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

module.exports = router
