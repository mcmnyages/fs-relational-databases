const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readinglist')
const Session = require('./session')


User.hasMany(Blog)
Blog.belongsTo(User)
User.belongsToMany(Blog, {
  through: ReadingList
})

Blog.belongsToMany(User, {
  through: ReadingList
})

User.belongsToMany(Blog, {
  through: ReadingList,
  as: 'readings',
  foreignKey: 'userId',
  otherKey: 'blogId'
})

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