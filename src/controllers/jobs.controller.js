const { Router } = require('express')
const { getProfile } = require('../middleware/getProfile')
const JobsService = require('../services/jobs.service')
const { errorHandler } = require('../utils')

class JobsController {
  router = Router()
  jobsService = new JobsService()

  constructor() {
    this.router
      .use(getProfile)
      .get('/unpaid', errorHandler(this.getUnpaidJobs))
      .post('/:id/pay', errorHandler(this.pay))
  }

  getUnpaidJobs = async (req, res) => {
    const jobs = await this.jobsService.getUnpaidJobs(req.profile)
    res.json(jobs)
  }

  pay = async (req, res) => {
    const job = await this.jobsService.pay(req.profile, req.params.id)

    if (!job) {
      return res.status(404).end()
    }

    res.json(job)
  }
}

module.exports = JobsController
