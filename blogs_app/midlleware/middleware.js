
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
  errorHandler
}
