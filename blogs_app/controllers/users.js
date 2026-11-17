
const router = require('express').Router()
const { User, Blog, ReadingList } = require('../models')
const bcrypt = require('bcrypt')

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
    const passwordHash = await bcrypt.hash(req.body.password, 10)

    const user = await User.create({
      name: req.body.name,
      username: req.body.username,
      passwordHash
    })

    const userJson = user.toJSON()
    delete userJson.passwordHash

    res.status(201).json(userJson)
  } catch (error) {
    next(error)
  }
})


// GET user by ID
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id)

    if (!user) {
      return res.status(404).end()
    }

    const where = {}

    if (req.query.read !== undefined) {
      where.read = req.query.read === 'true'
    }

    // Fetch only this user's reading-list entries
    const entries = await ReadingList.findAll({
      where: {
        userId: user.id,
        ...where
      }
    })

    // Fetch the blogs associated with those entries
    const readings = await Promise.all(
      entries.map(async entry => {
        const blog = await Blog.findByPk(entry.blogId)

        if (!blog) return null

        return {
          ...blog.toJSON(),
          readingList: {
            id: entry.id,
            read: entry.read
          }
        }
      })
    )

    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      readings: readings.filter(Boolean)
    })

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
