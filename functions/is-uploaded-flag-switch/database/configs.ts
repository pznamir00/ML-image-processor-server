export const configs = {
  test: {
    username: "test",
    password: "test",
    database: "test",
    host: "127.0.0.1",
    dialect: "postgres",
    port: 5433,
  },
  production: {
    username: process.env.dbUser || "",
    password: process.env.dbPassword || "",
    database: process.env.dbName || "",
    host: process.env.dbHost || "",
    port: +(process.env.dbPort || 5432),
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
