const { Job, Contract, sequelize, Profile } = require('../model')
const { Op } = require('sequelize')
const { ValidationError } = require('../errors')

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

  async pay(profile, id) {
    if (profile.type !== 'client') {
      throw new ValidationError('Only client can pay for job')
    }

    return sequelize.transaction(async (transaction) => {
      const job = await Job.findOne({
        include: {
          model: Contract,
          where: {
            status: 'in_progress',
            ClientId: profile.id,
          },
          required: true,
        },
        where: { id },
        lock: transaction.LOCK.UPDATE,
        transaction,
      })

      if (!job) {
        return null
      }

      if (job.paid) {
        throw new ValidationError('Job is already paid')
      }

      const profiles = await Profile.findAll({
        where: { id: { [Op.in]: [job.Contract.ClientId, job.Contract.ContractorId] } },
        lock: transaction.LOCK.UPDATE,
        transaction,
      })

      const client = profiles.find((item) => item.id === job.Contract.ClientId)
      const contractor = profiles.find((item) => item.id === job.Contract.ContractorId)

      if (!contractor) {
        throw new ValidationError('Contractor not found')
      }

      if (job.price > client.balance) {
        throw new ValidationError('Not enough funds')
      }

      job.paymentDate = new Date()
      job.paid = true

      client.balance -= job.price
      contractor.balance += job.price

      await Promise.all([
        client.save({ transaction }),
        contractor.save({ transaction }),
        job.save({ transaction }),
      ])

      return job.get({ plain: true })
    })
  }
}

module.exports = JobsService
