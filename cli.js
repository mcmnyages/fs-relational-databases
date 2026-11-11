
const { Sequelize, QueryTypes } = require('sequelize');

const sequelize = new Sequelize('blogs', 'postgres', 'your_password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
});

const main = async () => {
  try {
    const blogs = await sequelize.query(
      'SELECT * FROM blogs',
      { type: QueryTypes.SELECT }
    );

    blogs.forEach(blog => {
      console.log(
        `${blog.author}: '${blog.title}', ${blog.likes} likes`
      );
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
};

main();
