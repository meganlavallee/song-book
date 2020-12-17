// TODO: Table: Song, Score
// TODO: ROUTES: Add, Read, Update, Delete
// TODO: Setting up Connection
// TODO: Model of a playlist/post
// TODO: Config.json file

var Sequelize = require('sequelize');
const sequelize = require("sequelize");
const sequelizecli = require("sequelize-cli")
const express = require("express");
const expresshandlebars = require("express-handlebars");
const mysql = require("mysql");


var connection = new Sequelize
('sequelize_songbook', 'root', '', {
    host: 'localhost',
    port: 3306,
    dialect: 'sequelize',
  });

