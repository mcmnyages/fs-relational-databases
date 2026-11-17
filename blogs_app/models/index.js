const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readinglist')
const Session = require('./session')

// User owns blogs
User.hasMany(Blog)
Blog.belongsTo(User)

// User has reading-list entries
User.hasMany(ReadingList, {
  foreignKey: 'userId'
})
ReadingList.belongsTo(User, {
  foreignKey: 'userId'
})

// Blog has reading-list entries
Blog.hasMany(ReadingList, {
  foreignKey: 'blogId'
})
ReadingList.belongsTo(Blog, {
  foreignKey: 'blogId'
})

// Many-to-many relationship for reading lists
User.belongsToMany(Blog, {
  through: ReadingList,
  as: 'readings',
  foreignKey: 'userId',
  otherKey: 'blogId'
})

Blog.belongsToMany(User, {
  through: ReadingList,
  foreignKey: 'blogId',
  otherKey: 'userId'
})

// Sessions
User.hasMany(Session)
Session.belongsTo(User)

// We are removing authomatic sync to substitute with migrations
// const syncModels = async () => {
//     await User.sync({ alter: true })
//     await Blog.sync({ alter: true })
// }


module.exports = {
  Blog,
  User,
  Session,
  ReadingList
}