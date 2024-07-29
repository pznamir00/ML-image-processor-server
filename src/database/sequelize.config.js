// src/database/sequelize.config.js
require("ts-node/register");

const configs = require("./configs/configs.js");
module.exports = configs[process.env.NODE_ENV || "development"];
