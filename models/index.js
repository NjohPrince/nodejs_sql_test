const dbconfig = require('../config/dbconfig');

const { Sequelize, DataTypes, FLOAT }  = require("sequelize");

const sequelize = new Sequelize(dbconfig.DB, dbconfig.USER, dbconfig.PASSWORD, {
    host: dbconfig.HOST,
    dialect: dbconfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbconfig.pool.max,
        min: dbconfig.pool.min,
        acquire: dbconfig.pool.acquire,
        idle: dbconfig.pool.idle
    }
});

sequelize.authenticate().then(() => {
    console.log("Connected to the DB!");
}).catch((err) => {
    console.log("Connection error: ", err);
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('../models/userModel.js')(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
    console.log("Database & tables created!");
});

module.exports = db;
