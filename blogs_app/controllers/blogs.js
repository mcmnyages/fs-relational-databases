
const router = require('express').Router()
const { Blog } = require('../models')

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
    const blogs = await Blog.findAll()
    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

// POST a new blog
router.post('/', async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body)
    res.status(201).json(blog)
  } catch (error) {
    next(error)
  }
})

// GET a single blog
router.get('/:id', blogFinder, (req, res) => {
  res.json(req.blog)
})

// DELETE a blog
router.delete('/:id', blogFinder, async (req, res, next) => {
  try {
    await req.blog.destroy()
    res.status(204).end()
  } catch (error) {
    next(error)
  }
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

module.exports = router
