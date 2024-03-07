const mysql = require('mysql');
const express = require ('express');
const app = express();

// Create MySQL Connection
const dbb = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'healthcare'
});

// Connect to MySQL
dbb.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Connected to MySQL database!');
  });
  
  module.exports = dbb;
