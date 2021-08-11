const express = require('express');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const routes = require('./routes');

const app = express();

// settings
app.set('port', process.env.PORT || 3000);
const port = app.get('port');

const dbSettings = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '******',
    database: 'bookstore',
};

// middlewares
app.use(express.json());
app.use(myConnection(mysql, dbSettings, 'single'));

// routes
app.use(routes);

// starting the server
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
  });
