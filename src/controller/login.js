const { Router } = require('express')

const router = Router()

router.post('/', (req, res) => {
  res.send('Request Login use User Info.')
})

module.exports = router
