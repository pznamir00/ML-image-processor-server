import { Dialect, Options, Sequelize } from "sequelize";
import { config } from "./configs/config";

(Sequelize as any).postgres.DECIMAL.parse = parseFloat;

const connection: Sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  { ...config } as Options,
);

export default connection;
