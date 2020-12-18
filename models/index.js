"use strict";

const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

// Database Connection
const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    port: "5070",
    password: "password",
    database: "song"
})

route.listen(5070, () => {
    console.log("server running");
});


const song = {
  selectAll(cb) {
    orm.selectAll('song', res => cb(res));
  },
  insertOne(value, cb) {
    orm.insertOne('song', 'placeholder', res => cb(res), value);
  },
  updateOne(id, value, cb) {
    orm.updateOne('song', 'placeholder', value, 'id', id, res => cb(res));
  },
};

db.sequelize = sequelize;
db.sequelize = sequelize;

module.exports = db;