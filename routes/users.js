var express = require('express');
var router = express.Router();
// 引入mysql
var mysql = require('mysql');
//引入crypto
var crypto = require('crypto');


// 创建连接
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'userInfo'
});
//连接数据库
connection.connect();

/* GET users listing. */
//添加用户的路由
router.post('/add', function (req, res, next) {
  //接收前端
  let { username, pwd, group } = req.body;
  //加密密码
  pwd = crypto.createHash('md5').update(pwd).digest('hex');
  //查询username是否存在
  let searchSql = `select u_id from userinfo where userName='${username}' `
  connection.query(searchSql, function (error, results, fields) {
    if (error) {
      throw error;
    } else {
      if (results[0]) {
        res.send({ "msg": "账号已存在" })
      } else {
        //定义sql语句
        let insertSql = "insert into userInfo(userName,userPwd,userGroup) values(?,?,?)"
        //定义参数数组
        let paramsArr = [username, pwd, group];
        //执行语句，添加数据
        connection.query(insertSql, paramsArr, function (error, results, fields) {
          if (results.affectedRows > 0) {
            res.send({ 'isSuccess': true, 'msg': '账号添加成功' })
          } else {
            res.send({ 'isSuccess': false, 'msg': '账号添加失败' })
          }
        });
      }
    };
  });
});

//定义用户列表的路由          
router.get('/mangt', (req, res) => {
  //定义sql语句
  let searchSql = "select * from userinfo order by u_id DESC";
  //执行语句，添加数据
  connection.query(searchSql, function (error, results, fields) {
    if (error) {
      throw error;
    } else {
      res.send(results)
    }
  });
})

//定义删除用户的路由
router.get('/del', (req, res) => {
  //接收数据
  let u_id = req.query.u_id;
  //定义删除的sql语句
  let sqlStr = 'delete from userinfo where u_id=?';
  //定义参数数组
  let paramsArr = [u_id];
  connection.query(sqlStr, paramsArr, (err, result) => {
    if (err) {
      res.send({ 'isSuccess': false, 'msg': '删除失败' + err.message })
    } else {
      res.send({ 'isSuccess': true, 'msg': '删除成功' });
    }
  })
})

//定义编辑用户的路由
router.get('/edit', (req, res) => {
  // 接收前端发送的u_id
  let u_id = req.query.u_id;
  //定义查询的SQL语句
  let sqlStr = 'select * from userinfo where u_id=?';
  //定义参数数组
  let paramsArr = [u_id];
  //执行SQL语句
  connection.query(sqlStr, paramsArr, (err, oldData) => {
    if (err) throw err;
    //返回数据给前端
    res.send(oldData);
  })
})

//定义更新账号数据的路由
router.post('/save', function (req, res) {
  //接收前端
  let { username, pwd, group, u_id } = req.body;
  //加密密码
  pwd = crypto.createHash('md5').update(pwd).digest('hex');
  //定义sql语句,更新数据
  let sqlStr = "update userinfo set userName=?,userPwd=?,userGroup=? where u_id=?"
  //定义参数数组
  let paramsArr = [username,pwd,group,u_id];
  //执行语句，添加数据
  connection.query(sqlStr, paramsArr, function (error, results) {
    console.log(results)
    if (results.affectedRows > 0) {
      res.send({ 'isSuccess': true, 'msg': '信息修改成功' })
    } else {
      res.send({ 'isSuccess': false, 'msg': '信息修改失败' })
    }
  });
});
module.exports = router;
