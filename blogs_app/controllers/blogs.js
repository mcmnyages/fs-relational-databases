
const router = require('express').Router()
const { Blog, User } = require('../models')
const { userExtractor } = require('../midlleware/middleware')
 
// Middleware to find a blog by ID
const blogFinder = async (req, res, next) => {
  try {
    req.blog = await Blog.findByPk(req.params.id)

    if (!req.blog) {
      return res.status(404).end()
    }

    next()
  } catch (error) {
    next(error)
  }
}

// GET all blogs
router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.findAll({
      include: {
        model: User,
        attributes: ['id', 'name', 'username']
      }
    })

    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

// POST a new blog (requires authentication)
router.post('/', userExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.create({
      author: req.body.author,
      title: req.body.title,
      url: req.body.url,
      likes: req.body.likes || 0,
      userId: req.decodedToken.id
    })

    res.status(201).json(blog)
  } catch (error) {
    next(error)
  }
})

// GET a single blog
router.get('/:id', blogFinder, (req, res) => {
  res.json(req.blog)
})

// UPDATE a blog
router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } catch (error) {
    next(error)
  }
})

// DELETE a blog
router.delete('/:id', userExtractor, blogFinder, async (req, res, next) => {
  try {
    // Check if the authenticated user owns the blog
    if (req.blog.userId !== req.decodedToken.id) {
      return res.status(403).json({
        error: 'only the creator can delete this blog'
      })
    }

    await req.blog.destroy()

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router
