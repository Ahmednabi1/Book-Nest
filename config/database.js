const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("books", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
// sequelize.sync({ alter: true });
module.exports = sequelize;
