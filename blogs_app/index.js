const express = require('express')
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const app = express()

const blogssRouter = require('./controllers/blogs')

app.use(express.json())


app.use('/api/blogs', blogssRouter)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  res.status(400).json({
    error: error.message
  })
}
app.use(errorHandler)


const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()