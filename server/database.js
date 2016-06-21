var mysql = require('mysql');

var db = mysql.createPool({
    user: 'root',
    database: 'c9'
});

module.exports = db;