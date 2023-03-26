const JobsService = require('./jobs.service')
const { Profile, Contract, Job } = require('../model')
const { assert } = require('chai')

describe('JobsService', () => {
  let service

  before(() => {
    service = new JobsService()
  })

  describe('getUnpaidJobs', () => {
    it('should get job for client profile', async () => {
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

      const unpaidJobs = await service.getUnpaidJobs(client, contract.id)

      assert.lengthOf(unpaidJobs, 1)
      assert.deepOwnInclude(unpaidJobs[0], {
        description: 'work',
        price: 201,
      })
    })
  })
})
