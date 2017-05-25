'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('promise-mysql');
const log = require('npmlog');
const config = require('./configs/dev');
const app = express();

// Use globals for easier unit testing
if(!global.config){
  global.config = config;
}

if(!global.dbPool){
	global.dbPool = mysql.createPool(global.config.database);
}

if(!global.log){
  global.log = config.configureLogs(log);
}

app.use(bodyParser.json());

app.use(require('./controllers'));

app.listen('3000');
