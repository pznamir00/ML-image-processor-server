import { Options, Sequelize } from "sequelize";
import { configs } from "./configs";

export const connect = function () {
  const config = configs[process.env.NODE_ENV as keyof typeof configs];
  return new Sequelize(config.database, config.username, config.password, {
    ...config,
  } as Options);
};
