// TODO: Table: Song, Score
// TODO: ROUTES: Add, Read, Update, Delete
// TODO: Setting up Connection
// TODO: Model of a playlist/post
// TODO: Config.json file

// var Sequelize = require('sequelize');
const sequelize = require("sequelize");
const sequelizecli = require("sequelize-cli")
const express = require("express");
const expresshandlebars = require("express-handlebars");
const mysql = require("mysql");
const connection = require("./schema.sql")


// const connection = new Sequelize
// ('sequelize_songbook', 'root', '', {
//     host: 'localhost',
//     port: 3306,
//     dialect: 'sequelize',
//   });

// Database Connection
const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    port: "5070",
    password: "password",
    database: "song"
})

route.listen(8080, () => {
    console.log("server running");
});

module.exports = (sequelize, DataTypes) => {
    const ModelName = sequelize.define("table name", (
      songName:{
          type: DateDataType.STRING,
          allowNull: false,
          validate:(
              notEmpty: true,
        ),  
          
      },
}