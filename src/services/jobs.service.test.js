const JobsService = require('./jobs.service')
const { Profile, Contract, Job } = require('../model')
const { assert } = require('chai')
const { ValidationError } = require('../errors')

describe('JobsService', () => {
  const service = new JobsService()

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

  describe('payJob', () => {
    it('should return null if job not found', async () => {
      const [contractor] = await Profile.bulkCreate([
        {
          firstName: 'John',
          lastName: 'Lenon',
          profession: 'Musician',
          balance: 64,
          type: 'contractor',
        },
      ])

      try {
        await service.pay(contractor, 1)
      } catch (error) {
        assert.instanceOf(error, ValidationError)
      }
    })

    it('should through error if not enough funds', async () => {
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

      const [unpaidJob] = await Job.bulkCreate([
        {
          description: 'work',
          price: 1151,
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
        await service.pay(client, unpaidJob.id)
      } catch (error) {
        assert.instanceOf(error, ValidationError)
      }
    })

    it('should return paid job', async () => {
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

      const [unpaidJob] = await Job.bulkCreate([
        {
          description: 'work',
          price: 200,
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

      const job = await service.pay(client, unpaidJob.id)

      await client.reload()
      await contractor.reload()
      assert.strictEqual(job.paid, true)
      assert.instanceOf(job.paymentDate, Date)
      assert.strictEqual(client.balance, 950)
      assert.strictEqual(contractor.balance, 264)
    })

    it('should throe error for paid job', async () => {
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

      const [unpaidJob, paidJob] = await Job.bulkCreate([
        {
          description: 'work',
          price: 1151,
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
        await service.pay(client, paidJob.id)
      } catch (error) {
        assert.instanceOf(error, ValidationError)
      }
    })
  })
})
