var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'sql11.freemysqlhosting.net',
  user     : 'sql11168962',
  password : 'Ap8cpmbPpK',
  database : 'sql11168962'
});
var name = 'vlad'



module.exports = connection;