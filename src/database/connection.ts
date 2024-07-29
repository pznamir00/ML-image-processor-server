import { Dialect, Sequelize } from "sequelize";
import { config } from "./configs/config";

(Sequelize as any).postgres.DECIMAL.parse = parseFloat;

const connection: Sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect as Dialect,
    port: config.port,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

export default connection;
