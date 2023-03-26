const { Contract } = require('../model')
const { Op } = require('sequelize')

class ContractsService {
  getContract(profile, contractId) {
    return Contract.findOne({
      where: {
        id: contractId,
        [Op.or]: {
          ClientId: profile.id,
          ContractorId: profile.id,
        },
      },
      raw: true,
    })
  }

  getContracts(profile) {
    return Contract.findAll({
      where: {
        status: { [Op.not]: 'terminated' },
        [Op.or]: {
          ClientId: profile.id,
          ContractorId: profile.id,
        },
      },
      raw: true,
    })
  }
}

module.exports = ContractsService
