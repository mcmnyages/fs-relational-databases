
require('dotenv').config()

const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')

const app = express()

app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: process.env.NODE_ENV === 'production'
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    : {}
})

// Blog model
class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

// GET all blogs
app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

// POST a new blog
app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    res.status(201).json(blog)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// DELETE a blog
app.delete('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)

  if (blog) {
    await blog.destroy()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

// Start server after database connection and synchronization
const PORT = process.env.PORT || 3001

const start = async () => {
  try {
    await sequelize.authenticate()
    await Blog.sync()

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Unable to connect to database:', error)
  }
}

start()
