const { assert } = require('chai')
const { Profile, Contract, Job } = require('../model')
const BalancesService = require('./balances.service')

describe('BalancesService', () => {
  const service = new BalancesService()

  describe('deposit', () => {
    it('should deposit', async () => {
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

      const [contract] = await Contract.bulkCreate([
        {
          terms: 'bla bla bla',
          status: 'in_progress',
          ClientId: client.id,
          ContractorId: contractor.id,
        },
        {
          terms: 'bla bla bla',
          status: 'terminated',
          ClientId: client.id,
          ContractorId: contractor.id,
        },
      ])

      await Job.bulkCreate([
        {
          description: 'work',
          price: 201,
          ContractId: contract.id,
        },
        {
          description: 'work',
          price: 200,
          paid: true,
          paymentDate: '2020-08-15T19:11:26.737Z',
          ContractId: contract.id,
        },
        {
          description: 'work',
          price: 21,
          paid: true,
          paymentDate: '2020-08-15T19:11:26.737Z',
          ContractId: contract.id,
        },
      ])

      const profile = await service.deposit(client.id, 50)
      await client.reload()

      assert.strictEqual(profile.balance, 1200)
      assert.strictEqual(client.balance, 1200)
    })

    it('should not deposit if amount is greater than 25% of unpaid jobs price', async () => {
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

      const [contract] = await Contract.bulkCreate([
        {
          terms: 'bla bla bla',
          status: 'in_progress',
          ClientId: client.id,
          ContractorId: contractor.id,
        },
        {
          terms: 'bla bla bla',
          status: 'terminated',
          ClientId: client.id,
          ContractorId: contractor.id,
        },
      ])

      await Job.bulkCreate([
        {
          description: 'work',
          price: 201,
          ContractId: contract.id,
        },
        {
          description: 'work',
          price: 200,
          paid: true,
          paymentDate: '2020-08-15T19:11:26.737Z',
          ContractId: contract.id,
        },
        {
          description: 'work',
          price: 21,
          paid: true,
          paymentDate: '2020-08-15T19:11:26.737Z',
          ContractId: contract.id,
        },
      ])

      try {
        await service.deposit(client.id, 1000)
      } catch (error) {
        assert.strictEqual(error.message, 'Deposit amount must be less than 50.25')
      }
    })
  })
})
