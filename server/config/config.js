require('dotenv').config(); // Load .env

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: '127.0.0.1', // Using IP instead of localhost
    port: 3306,
    dialect: 'mysql',
  },
};

