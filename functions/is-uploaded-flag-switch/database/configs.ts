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
    username: process.env.DBUser || "",
    password: process.env.DBPassword || "",
    database: process.env.DBName || "",
    host: process.env.DBHost || "",
    port: +(process.env.DBPort || 5432),
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
