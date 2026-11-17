const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

const userExtractor = async (req, res, next) => {
  try {
    const authorization = req.get('authorization')

    if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
      return res.status(401).json({
        error: 'token missing or invalid'
      })
    }

    const token = authorization.substring(7).trim()

    if (!token) {
      return res.status(401).json({
        error: 'token missing or invalid'
      })
    }

    const decodedToken = jwt.verify(token, SECRET)

    if (!decodedToken.id) {
      return res.status(401).json({
        error: 'token invalid'
      })
    }

    // Check whether the session exists
    const session = await Session.findOne({
      where: {
        token,
        userId: decodedToken.id
      }
    })

    if (!session) {
      return res.status(401).json({
        error: 'session expired or invalid'
      })
    }

    // Check whether the user exists and is enabled
    const user = await User.findByPk(decodedToken.id)

    if (!user || user.disabled) {
      return res.status(401).json({
        error: 'account disabled or user not found'
      })
    }

    req.decodedToken = decodedToken
    req.user = user
    req.token = token

    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'token missing or invalid'
      })
    }

    next(error)
  }
}


const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError'
  ) {
    return res.status(400).json({
      error: error.errors.map(err => {
        if (err.validatorKey === 'isEmail') {
          return 'username must be a valid email address'
        }

        return err.message
      })
    })
  }

  next(error)
}

module.exports = {
  userExtractor,
  errorHandler
}
