const express = require('express')
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

//controllers
const blogssRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const testingRouter = require('./controllers/testing')
const readinglistsRouter = require('./controllers/readinglists')

const middlware = require('./midlleware/middleware')

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.json(200)
})

app.use('/api/blogs', blogssRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readinglistsRouter)
app.use('/api', testingRouter)

app.use(middlware.errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()