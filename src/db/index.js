import { Sequelize } from "sequelize";

import config from "../config/index.js";

const { db, host, password, port, user } = config.db;

// console.log(db, host, password, port, user);

const sequelize = new Sequelize(db, user, password, {
    host,
    dialect: "postgres",
    port,
    logging: false,
});

export default sequelize;
