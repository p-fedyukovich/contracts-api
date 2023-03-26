const { Profile, Contract, Job } = require('../model')
const AdminService = require('./admin.service')
const { assert } = require('chai')

describe('AdminService', () => {
  const service = new AdminService()
  describe('getBestProfession', () => {
    it('should return best prof', async () => {
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
          paymentDate: new Date(Date.now() - 60 * 1000),
          ContractId: contract.id,
        },
        {
          description: 'work',
          price: 21,
          paid: true,
          paymentDate: new Date(Date.now() - 60 * 1000),
          ContractId: contract.id,
        },
      ])

      const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      const now = new Date()
      const jobs = await service.getBestProfession(oneYearAgo, now)

      assert.deepOwnInclude(jobs, {
        profession: 'Musician',
        totalPrice: 221,
      })
    })
  })

  describe('getBestClients', () => {
    it('should return best clients', async () => {
      const [client1, client2, contractor1, contractor2] = await Profile.bulkCreate([
        {
          firstName: 'Harry',
          lastName: 'Potter',
          profession: 'Wizard',
          balance: 1150,
          type: 'client',
        },
        {
          firstName: 'Mr',
          lastName: 'Robot',
          profession: 'Hacker',
          balance: 231.11,
          type: 'client',
        },
        {
          firstName: 'John',
          lastName: 'Lenon',
          profession: 'Musician',
          balance: 64,
          type: 'contractor',
        },
        {
          firstName: 'Linus',
          lastName: 'Torvalds',
          profession: 'Programmer',
          balance: 1214,
          type: 'contractor',
        },
      ])

      const [contract1, contract2, contract3] = await Contract.bulkCreate([
        {
          terms: 'bla bla bla',
          status: 'in_progress',
          ClientId: client1.id,
          ContractorId: contractor1.id,
        },
        {
          terms: 'bla bla bla',
          status: 'terminated',
          ClientId: client1.id,
          ContractorId: contractor1.id,
        },
        {
          terms: 'bla bla bla',
          status: 'in_progress',
          ClientId: client2.id,
          ContractorId: contractor2.id,
        },
      ])

      await Job.bulkCreate([
        {
          description: 'work',
          price: 201,
          ContractId: contract1.id,
        },
        {
          description: 'work',
          price: 200,
          paid: true,
          paymentDate: new Date(Date.now() - 60 * 1000),
          ContractId: contract1.id,
        },
        {
          description: 'work',
          price: 21,
          paid: true,
          paymentDate: new Date(Date.now() - 60 * 1000),
          ContractId: contract1.id,
        },
        {
          description: 'work',
          price: 13,
          paid: true,
          paymentDate: new Date(Date.now() - 60 * 1000),
          ContractId: contract3.id,
        },
      ])

      const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      const now = new Date()
      const clients = await service.getBestClients(oneYearAgo, now, 10)

      assert.deepOwnInclude(clients[0], {
        fullName: 'Harry Potter',
        id: client1.id,
        totalPaid: 221,
      })
    })
  })
})
