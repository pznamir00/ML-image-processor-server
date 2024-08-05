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
    username: process.env.DbUser || "",
    password: process.env.DbPassword || "",
    database: process.env.DbName || "",
    host: process.env.DbHost || "",
    port: +(process.env.DbPort || 5432),
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
