// src/database/sequelize.config.js
require("ts-node/register");

const configs = require("./configs/configs.json");
module.exports = configs[process.env.NODE_ENV || "development"];
