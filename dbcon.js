var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_speart',
    password        : '9146',
    database        : 'cs340_speart'
});

module.exports.pool = pool;
