
const router = require('express').Router()
const { ReadingList, User, Blog } = require('../models')
const { userExtractor } = require('../midlleware/middleware')

// Add a blog to a user's reading list
router.post('/', async (req, res, next) => {
  try {
    const { blogId, userId } = req.body

    const user = await User.findByPk(userId)

    if (!user) {
      return res.status(400).json({
        error: 'userId is invalid'
      })
    }

    const blog = await Blog.findByPk(blogId)

    if (!blog) {
      return res.status(400).json({
        error: 'blogId is invalid'
      })
    }

    const reading = await ReadingList.create({
      userId,
      blogId,
      read: false
    })

    res.status(201).json(reading)
  } catch (error) {
    next(error)
  }
})

// Mark a reading-list blog as read
router.put('/:id', userExtractor, async (req, res, next) => {
  try {
    const reading = await ReadingList.findByPk(req.params.id)

    if (!reading) {
      return res.status(404).json({
        error: 'reading list entry not found'
      })
    }

    // Ensure the entry belongs to the logged-in user
    if (reading.userId !== req.decodedToken.id) {
      return res.status(403).json({
        error: 'you can only update your own reading list'
      })
    }

    reading.read = req.body.read

    await reading.save()

    res.json(reading)
  } catch (error) {
    next(error)
  }
})

module.exports = router
