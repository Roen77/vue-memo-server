require('dotenv').config();

module.exports={
    "development": {
      "username": "postgres",
      "password": process.env.SEQUELIZE_PASSWORD,
      "database": "memoApp",
      "host": "127.0.0.1",
      "dialect": "postgres",
      "port":5432
    },
    "test": {
      "username": "root",
      "password": process.env.SEQUELIZE_PASSWORD,
      "database": "memoApp",
      "host": "127.0.0.1",
      "dialect": "postgres",
      "port":5432
    },
    "production": {
      "username": "root",
      "password": process.env.SEQUELIZE_PASSWORD,
      "database": "memoApp",
      "host": "127.0.0.1",
      "dialect": "postgres",
      "port":5432,
      logging: false
    }
  }
  