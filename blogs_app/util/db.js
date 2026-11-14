const Sequelize = require('sequelize')
const { DATABASE_URL,TEST_DATABASE_URL } = require('./config')

const databaseUrl = process.env.TESTING === 'true'
  ? TEST_DATABASE_URL
  : DATABASE_URL

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  dialectOptions: process.env.NODE_ENV === 'production'
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    : {}
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database\n',err)
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }
