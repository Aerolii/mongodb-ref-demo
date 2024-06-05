const { Router } = require('express')
const { validate, Customer } = require('../models/customer')

const router = Router()

// 授权
// 这里应该是授权用户是否能够做某件事
router.get('/', (req, res) => {
  res.send('get all customers')
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  const { name, isGold, phone, address } = req.body
  let customer = new Customer({
    name,
    isGold,
    phone,
    address
  })

  try {
    customer = await customer.save()
    res.send(customer)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/:id', (req, res) => {
  res.send(`get a customer with ID ${req.params.id}`)
})

// update
router.put('/:id', (req, res) => {
  res.send(`update customer with ID ${req.params.id}`)
})

module.exports = router
