require("dotenv").config();

module.exports = {
  development: {
    username: "postgres",
    password: "postgres",
    database: "postgres",
    host: "127.0.0.1",
    dialect: "postgres",
    port: 5432,
  },
  test: {
    username: "test",
    password: "test",
    database: "test",
    host: "127.0.0.1",
    dialect: "postgres",
    port: 5433,
    logging: false,
  },
  production: {
    username: process.env.PROD_DB_USERNAME || "",
    password: process.env.PROD_DB_PASSWORD || "",
    database: process.env.PROD_DB_NAME || "",
    host: process.env.PROD_DB_HOST || "",
    dialect: "postgres",
    port: +process.env.PROD_DB_PORT || 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
