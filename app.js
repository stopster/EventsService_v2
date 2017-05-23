const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./models/db.js');

// if(GLOBAL.SQLpool === undefined){
// 	GLOBAL.SQLpool = db.createPool(); //create a global sql pool connection
// }

app.use(bodyParser.json());

app.use(require('./controllers'));

app.listen('3000');
