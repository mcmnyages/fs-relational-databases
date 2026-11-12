
const router = require('express').Router()

const { Blog } = require('../models')

// GET all blogs
router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

// POST a new blog
router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    res.status(201).json(blog)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

// GET a single blog
router.get('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)

  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

// DELETE a blog
router.delete('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)

  if (blog) {
    await blog.destroy()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

// UPDATE a blog
router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)

  if (blog) {
    blog.author = req.body.author
    blog.title = req.body.title
    blog.url = req.body.url
    blog.likes = req.body.likes

    await blog.save()
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

module.exports = router
