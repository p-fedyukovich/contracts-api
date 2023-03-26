const ContractsService = require('./contracts.service')
const { Profile, Contract } = require('../model')
const { assert } = require('chai')

describe('ContractsService', () => {
  let contractsService

  before(() => {
    contractsService = new ContractsService()
  })

  describe('getContract', () => {
    it('should get contract for client profile', async () => {
      const [client, contractor] = await Profile.bulkCreate([
        {
          firstName: 'Harry',
          lastName: 'Potter',
          profession: 'Wizard',
          balance: 1150,
          type: 'client',
        },
        {
          firstName: 'John',
          lastName: 'Lenon',
          profession: 'Musician',
          balance: 64,
          type: 'contractor',
        },
      ])
      const contract = await Contract.create({
        terms: 'bla bla bla',
        status: 'terminated',
        ClientId: client.id,
        ContractorId: contractor.id,
      })

      const foundContract = await contractsService.getContract(client, contract.id)

      assert.deepOwnInclude(foundContract, {
        terms: 'bla bla bla',
        status: 'terminated',
        ClientId: client.id,
        ContractorId: contractor.id,
      })
    })

    it('should get contract for contractor profile', async () => {
      const [client, contractor] = await Profile.bulkCreate([
        {
          firstName: 'Harry',
          lastName: 'Potter',
          profession: 'Wizard',
          balance: 1150,
          type: 'client',
        },
        {
          firstName: 'John',
          lastName: 'Lenon',
          profession: 'Musician',
          balance: 64,
          type: 'contractor',
        },
      ])
      const contract = await Contract.create({
        terms: 'bla bla bla',
        status: 'terminated',
        ClientId: client.id,
        ContractorId: contractor.id,
      })

      const foundContract = await contractsService.getContract(contractor, contract.id)

      assert.deepOwnInclude(foundContract, {
        terms: 'bla bla bla',
        status: 'terminated',
        ClientId: client.id,
        ContractorId: contractor.id,
      })
    })

    it('should not get contract for another client profile', async () => {
      const [client1, client2, contractor] = await Profile.bulkCreate([
        {
          firstName: 'Harry',
          lastName: 'Potter',
          profession: 'Wizard',
          balance: 1150,
          type: 'client',
        },
        {
          firstName: 'Harry',
          lastName: 'Potter',
          profession: 'Wizard',
          balance: 1150,
          type: 'client',
        },
        {
          firstName: 'John',
          lastName: 'Lenon',
          profession: 'Musician',
          balance: 64,
          type: 'contractor',
        },
      ])

      const contract = await Contract.create({
        terms: 'bla bla bla',
        status: 'terminated',
        ClientId: client2.id,
        ContractorId: contractor.id,
      })

      const foundContract = await contractsService.getContract(client1, contract.id)

      assert.isNull(foundContract)
    })
  })

  describe('getContracts', () => {
    it('should get contracts for client profile', async () => {
      const [client, contractor] = await Profile.bulkCreate([
        {
          firstName: 'Harry',
          lastName: 'Potter',
          profession: 'Wizard',
          balance: 1150,
          type: 'client',
        },
        {
          firstName: 'John',
          lastName: 'Lenon',
          profession: 'Musician',
          balance: 64,
          type: 'contractor',
        },
      ])

      await Contract.bulkCreate([
        {
          terms: 'bla bla bla',
          status: 'terminated',
          ClientId: client.id,
          ContractorId: contractor.id,
        },
        {
          terms: 'bla bla bla',
          status: 'in_progress',
          ClientId: client.id,
          ContractorId: contractor.id,
        },
      ])

      const foundContracts = await contractsService.getContracts(client)

      assert.lengthOf(foundContracts, 1)
      assert.deepOwnInclude(foundContracts[0], {
        status: 'in_progress',
      })
    })

    it('should get contracts for contractor profile', async () => {
      const [client, contractor] = await Profile.bulkCreate([
        {
          firstName: 'Harry',
          lastName: 'Potter',
          profession: 'Wizard',
          balance: 1150,
          type: 'client',
        },
        {
          firstName: 'John',
          lastName: 'Lenon',
          profession: 'Musician',
          balance: 64,
          type: 'contractor',
        },
      ])

      await Contract.bulkCreate([
        {
          terms: 'bla bla bla',
          status: 'terminated',
          ClientId: client.id,
          ContractorId: contractor.id,
        },
        {
          terms: 'bla bla bla',
          status: 'in_progress',
          ClientId: client.id,
          ContractorId: contractor.id,
        },
      ])

      const foundContracts = await contractsService.getContracts(contractor)

      assert.lengthOf(foundContracts, 1)
      assert.deepOwnInclude(foundContracts[0], {
        status: 'in_progress',
      })
    })
  })
})
