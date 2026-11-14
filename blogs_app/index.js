const express = require('express')
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogssRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const middlware = require('./midlleware/middleware')


const app = express()

app.use(express.json())


app.use('/api/blogs', blogssRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)


app.use(middlware.errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()