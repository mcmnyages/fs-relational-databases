const express = require('express')
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const app = express()

const blogssRouter = require('./controllers/blogs')

app.use(express.json())

app.use('/api/blogs', blogssRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()