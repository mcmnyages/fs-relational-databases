
const router = require('express').Router()
const { ReadingList, User, Blog } = require('../models')
const { userExtractor } = require('../midlleware/middleware')

// Add a blog to a user's reading list
router.post('/', async (req, res, next) => {
  try {
    const { blogId, userId } = req.body

    if (!blogId || !userId) {
      return res.status(400).json({
        error: 'blogId and userId are required'
      })
    }

    const user = await User.findByPk(userId)

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      })
    }

    const blog = await Blog.findByPk(blogId)

    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found'
      })
    }

    // Check for duplicate entries
    const existingReading = await ReadingList.findOne({
      where: {
        userId,
        blogId
      }
    })

    if (existingReading) {
      return res.status(400).json({
        error: 'Blog already exists in reading list'
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
        error: 'Reading list entry not found'
      })
    }

    // Check ownership
    if (reading.userId !== req.decodedToken.id) {
      return res.status(401).json({
        error: 'You can only update your own reading list'
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
