const Blog = require('./blog')
const User = require('./user')

User.hasMany(Blog)
Blog.belongsTo(User)

// We are removing authomatic sync to substitute with migrations
// const syncModels = async () => {
//     await User.sync({ alter: true })
//     await Blog.sync({ alter: true })
// }

module.exports = {
    Blog,
    User,
   
}