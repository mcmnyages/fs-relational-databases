const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const userExtractor = (req, res, next) => {
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

    req.decodedToken = decodedToken

    next()
  } catch (error) {
    return res.status(401).json({
      error: 'token missing or invalid'
    })
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
