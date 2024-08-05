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
    username: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
    host: process.env.DB_HOST || "",
    port: +(process.env.DB_PORT || 5432),
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
