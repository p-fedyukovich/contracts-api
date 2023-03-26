const { sequelize } = require('../src/model')

before(async () => {
  await sequelize.sync({ force: true })
})

afterEach(async () => {
  await sequelize.truncate({ cascade: true })
})
