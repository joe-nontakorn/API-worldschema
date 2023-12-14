require('dotenv').config();
const knex = require("knex");


const knexConfig = {
  client: "mysql2",
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASES,
  },
};

const db = knex(knexConfig);
module.exports = db;
