import { Dialect, Sequelize } from "sequelize";
import { config } from "./configs/config";

const connection: Sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect as Dialect,
    port: config.port,
  }
);

export default connection;
