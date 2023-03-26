const { Job, Contract } = require('../model')
const { Op } = require('sequelize')

class JobsService {
  async getUnpaidJobs(profile) {
    return Job.findAll({
      include: {
        attributes: [],
        model: Contract,
        where: {
          status: 'in_progress',
          [Op.or]: {
            ClientId: profile.id,
            ContractorId: profile.id,
          },
        },
        required: true,
      },
      where: {
        paid: { [Op.not]: true },
      },
      raw: true,
    })
  }
}

module.exports = JobsService
