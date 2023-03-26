const { Router } = require('express')
const { errorHandler } = require('../utils')
const BalancesService = require('../services/balances.service')

class BalancesController {
  router = Router()
  service = new BalancesService()

  constructor() {
    this.router.post('/deposit/:userId', errorHandler(this.deposit))
  }

  deposit = async (req, res) => {
    const jobs = await this.service.deposit(req.params.userId, req.body.amount)
    res.json(jobs)
  }
}

module.exports = BalancesController
