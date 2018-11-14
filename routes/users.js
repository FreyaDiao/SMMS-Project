var express = require('express');
var router = express.Router();
// 引入conectMysql
var connection = require('./connectMysql');
//引入crypto
var crypto = require('crypto');


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
  let { username, pwd, group,isLocked,u_id } = req.body;
  //加密密码
  pwd = crypto.createHash('md5').update(pwd).digest('hex');
  //定义sql语句,更新数据
  let sqlStr = "update userinfo set userName=?,userPwd=?,userGroup=?,isLocked=? where u_id=?"
  //定义参数数组
  let paramsArr = [username,pwd,group,isLocked,u_id];
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

//定义检测用户名和密码的路由,如果正确，则添加cookie
router.post('/checkUser',(req,res)=>{
  //接收数据
  let {username,checkPass}=req.body;
  //定义SQL语句查找数据
  let sqlStr = 'select * from userInfo where userName=? and userPwd=?';
  //加密密码
  checkPass = crypto.createHash('md5').update(checkPass).digest('hex');
  //定义参数数组
  let paramsArr = [username,checkPass];
  //执行SQL语句
  connection.query(sqlStr,paramsArr,(err,result)=>{
    console.log(result)
    if(err) throw err;//抛出错误
    //判断，如果查询的结果存在，则验证通过,添加cookie；否则验证不通过
    if(result[0]){
      res.cookie('username',username);
      res.cookie('u_id',result[0].u_id);
      res.cookie('userGroup',result[0].userGroup);
      res.send({'isOk':true,'msg':'登录成功'});
    }else{
      res.send({'isOk':false,'msg':'用户名或者密码不正确'});
    }
  })
});

//定义创建围墙的路由
router.get('/checkCookie',(req,res)=>{
  //读取username
  let username = req.cookies.username;
  let u_id = req.cookies.u_id;
  //数据库中查找username和u_id对应的账号状态
  let sqlStr = 'select isLocked from userinfo where userName=? and u_id=?';
  let paramsArr = [username,u_id]
  connection.query(sqlStr,paramsArr,(err,result)=>{
    //判断账号是否锁定
    if(result[0]){
      if(!result[0].isLocked){
        res.send({'isOk':true,'loginName':username})
      }else{
        res.send("alert('登录失败，账户已锁定');location.href='login.html'")
      }
    }else{
      res.send("alert('请登录后再访问');location.href='login.html'")
    }
  })
});

//定义登出销毁cookie的路由
router.get('/logout',(req,res)=>{
  res.clearCookie('username');
  res.clearCookie('u_id');
  res.clearCookie('userGroup');
  res.redirect('/login.html');
});



module.exports = router;
