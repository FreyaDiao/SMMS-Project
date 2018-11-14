
// 引入mysql
var mysql = require('mysql');

// 创建连接
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'userInfo'
  });
  
//连接数据库
connection.connect();

//暴露connection
module.exports=connection;