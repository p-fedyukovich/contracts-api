const { sequelize, Profile, Job, Contract } = require('../model')
const { Op } = require('sequelize')
const { ValidationError } = require('../errors')

class BalancesService {
  async deposit(userId, amount) {
    return sequelize.transaction(async (transaction) => {
      if (typeof amount !== 'number') {
        throw new ValidationError('Deposit amount must be a number')
      }

      if (amount <= 0) {
        throw new ValidationError('Deposit amount must be positive')
      }

      const profile = await Profile.findOne({
        where: { id: userId, type: 'client' },
        lock: transaction.LOCK.UPDATE,
        transaction,
      })

      if (!profile) {
        return null
      }

      const [jobs] = await Job.findAll({
        attributes: [[sequelize.fn('SUM', sequelize.col('price')), 'total']],
        where: { paid: { [Op.not]: true } },
        include: {
          model: Contract,
          attributes: [],
          where: { status: 'in_progress', ClientId: userId },
          required: true,
        },
        raw: true,
        transaction,
      })

      if (jobs.total === null) {
        throw new ValidationError('All jobs are payed')
      }

      const maxAmount = jobs.total * 0.25
      if (amount > maxAmount) {
        throw new ValidationError(`Deposit amount must be less than ${maxAmount}`)
      }

      profile.balance += amount

      return profile.save({ transaction })
    })
  }
}

module.exports = BalancesService
