const { Op, col, fn, literal } = require('sequelize')
const { Job, Contract } = require('../model')

class AdminService {
  getBestProfession(startDate, endDate) {
    return Job.findOne({
      where: {
        paid: true,
        paymentDate: { [Op.between]: [startDate, endDate] },
      },
      include: {
        model: Contract,
        attributes: [],
        include: {
          association: 'Contractor',
          attributes: [],
        },
      },
      attributes: [
        [col('Contract.Contractor.profession'), 'profession'],
        [fn('SUM', col('price')), 'totalPrice'],
      ],
      group: 'Contract.Contractor.profession',
      order: [['totalPrice', 'DESC']],
      raw: true,
    })
  }

  getBestClients(startDate, endDate, limit) {
    return Job.findAll({
      where: {
        paid: true,
        paymentDate: { [Op.between]: [startDate, endDate] },
      },
      include: {
        model: Contract,
        attributes: [],
        include: {
          association: 'Client',
          attributes: [],
        },
      },
      attributes: [
        [col('Contract.Client.id'), 'id'],
        [
          literal("`Contract->Client`.`firstName` || ' ' || `Contract->Client`.`lastName`"),
          'fullName',
        ],
        [fn('SUM', col('price')), 'totalPaid'],
      ],
      group: 'Contract.Client.id',
      order: [['totalPaid', 'DESC']],
      raw: true,
      limit,
    })
  }
}

module.exports = AdminService
