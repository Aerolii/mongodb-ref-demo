const { Router } = require('express')
const { Rental, validate } = require('../models/rental')
const { Movie } = require('../models/movie')
const { Customer } = require('../models/customer')
const { default: mongoose } = require('mongoose')

const router = Router()

router.get('/', async (req, res) => {
  const rentals = await Rental.find()
  res.send(rentals)
})

/**
 * 请求提必须包含 movieId customerId
 */
router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }
  const { customerId, movieId } = req.body

  const movie = await Movie.findById(movieId)

  if (!movie) {
    return res.status(400).send('Invalid Movie')
  }

  const customer = await Customer.findById(customerId)

  if (!customer) {
    return res.status(400).send('Invalid Customer')
  }

  if (movie.numberInStock <= 0) {
    return res.status(400).send('Movie not in stock')
  }

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRateRental
    }
  })

  movie.numberInStock -= 1

  // #TODO:
  // 两个关联的模型应该同时成功或失败
  // 需要类似 关系型数据库 中的事务来进行处理

  const session = await mongoose.connection.startSession()
  try {
    await session.withTransaction(async () => {
      // 参考
      // https://www.jianshu.com/p/70ffd70fde84
      // 由于equip不是通过session查询到的，所以如果不加{session}，那么equip.save不会被认为是事务的一部分，我们需要手动加上
      // await equip.save({ session })
      // allZone是通过session查询到的，所以可以不加{session}，文档会自动使用该session来执行save操作，被认为是事务的一部分
      // await allZone.save()

      await movie.save({ session })
      rental = await rental.save({ session })
      throw new Error('error ')
    })
    res.send(rental)
  } catch (error) {
    res.status(500).send(`Database Error: ${error.message}`)
  } finally {
    session.endSession()
  }

  // rental = await rental.save()
  // await movie.save()
})

module.exports = router
