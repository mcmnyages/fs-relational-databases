
const router = require('express').Router()
const { User, Blog } = require('../models')

// GET all users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: {
        model: Blog
      }
    })

    res.json(users)
  } catch (error) {
    next(error)
  }
})

// POST a new user
router.post('/', async (req, res, next) => {
  try {
    const user = await User.create({
      name: req.body.name,
      username: req.body.username
    })

    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
})

// GET user by ID


router.get('/:id', async (req, res, next) => {
  try {
    const where = {}

    if (req.query.read) {
      where.read = req.query.read === 'true'
    }

    const user = await User.findByPk(req.params.id, {
      include: {
        model: Blog,
        as: 'readings',
        attributes: [
          'id',
          'url',
          'title',
          'author',
          'likes',
          'year'
        ],
        through: {
          attributes: ['read', 'id'],
          where
        }
      }
    })

    if (user) {
      res.json(user)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})



// UPDATE user name using username
router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.params.username
      }
    })

    if (user) {
      user.name = req.body.name
      await user.save()

      res.json(user)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
