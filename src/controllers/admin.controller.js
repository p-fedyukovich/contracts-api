const { Router } = require('express')
const z = require('zod')
const { errorHandler } = require('../utils')
const AdminService = require('../services/admin.service')
const { ValidationError } = require('../errors')
const datetime = z.string().datetime()

class AdminController {
  router = Router()
  service = new AdminService()

  constructor() {
    this.router
      .get('/best-profession', errorHandler(this.bestProfession))
      .get('/best-client', errorHandler(this.bestClient))
  }

  bestProfession = async (req, res) => {
    let start
    let end

    try {
      start = datetime.parse(req.query.start)
      end = datetime.parse(req.query.end)
    } catch (error) {
      throw new ValidationError('Some of dates is not provided')
    }

    const profession = await this.service.getBestProfession(start, end)

    if (!profession) {
      if (!profession) {
        return res.status(404).end()
      }
    }

    res.json(profession)
  }

  bestClient = async (req, res) => {
    const start = datetime.parse(req.query.start)
    const end = datetime.parse(req.query.end)

    if (!start || !end) {
      throw new ValidationError('Some of dates is not provided')
    }

    let limit = 2
    if (req.query.limit) {
      const number = parseInt(req.query.limit)
      if (!isNaN(number)) {
        limit = number
      }
    }

    const items = await this.service.getBestClients(start, end, limit)

    res.json(items)
  }
}

module.exports = AdminController
