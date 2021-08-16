const express = require('express');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const routes = require('./routes');

const dbSettings = require('../config.json');
// {
//   host: "localhost",
//   port: 3306,
//   user: "root",
//   password: "****",
//   database: "bookstore"
// }

const app = express();

// settings
app.set('port', process.env.PORT || 3000);
const port = app.get('port');

// middlewares
app.use(express.json());
app.use(myConnection(mysql, dbSettings, 'single'));

// routes
app.use(routes);

// starting the server
app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
