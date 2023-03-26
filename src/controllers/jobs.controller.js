const { Router } = require('express')
const { getProfile } = require('../middleware/getProfile')
const JobsService = require('../services/jobs.service')
const { errorHandler } = require('../utils')

class JobsController {
  router = Router()
  jobsService = new JobsService()

  constructor() {
    this.router.use(getProfile).get('/unpaid', errorHandler(this.getUnpaidJobs))
  }

  getUnpaidJobs = async (req, res) => {
    const jobs = await this.jobsService.getUnpaidJobs(req.profile)
    res.json(jobs)
  }
}

module.exports = JobsController
