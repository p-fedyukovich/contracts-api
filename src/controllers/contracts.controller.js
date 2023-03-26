const { Router } = require('express')
const { getProfile } = require('../middleware/getProfile')
const ContractsService = require('../services/contracts.service')
const { errorHandler } = require('../utils')

class ContractsController {
  router = Router()
  contractsService = new ContractsService()

  constructor() {
    this.router
      .use(getProfile)
      .get('/:id', errorHandler(this.getContract))
      .get('/', errorHandler(this.getContracts))
  }

  getContract = async (req, res) => {
    const { id } = req.params

    const contract = await this.contractsService.getContract(req.profile, id)
    if (!contract) {
      return res.status(404).end()
    }
    res.json(contract)
  }

  getContracts = async (req, res) => {
    const contracts = await this.contractsService.getContracts(req.profile)
    res.json(contracts)
  }
}

module.exports = ContractsController
