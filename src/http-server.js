const express = require('express')
const { sequelize } = require('./model')
const ContractsController = require('./controllers/contracts.controller')
const JobsController = require('./controllers/jobs.controller')

class HttpServer {
  app = express()

  constructor() {
    this.app
      .use(express.json())
      .set('sequelize', sequelize)
      .set('models', sequelize.models)
      .use('/contracts', new ContractsController().router)
      .use('/jobs', new JobsController().router)
      .use((error, req, res, next) => {
        console.error(error)
        res.status(500).json({
          message: 'Internal Server Error',
        })
      })
  }

  listen(port) {
    return new Promise((resolve) => this.app.listen(port, resolve))
  }
}

module.exports = HttpServer
