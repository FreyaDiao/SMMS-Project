
var express = require('express');
var router = express.Router();
// 引入conectMysql
var connection = require('./connectMysql');



/* GET users listing. */
//添加类别的路由
router.post('/add', function (req, res, next) {
    //接收数据
    let {cg_name,cg_isEnable,cg_fatherID} = req.body;
    //定义sql语句
    let sqlStr = 'insert into goodsCategory(cg_name,cg_isEnable,cg_fatherID) values(?,?,?)';
    let paramsArr = [cg_name,cg_isEnable,cg_fatherID];
    connection.query(sqlStr,paramsArr,(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({'isOk':true,'msg':'分类添加成功！ '})
        }else{
            res.send({'isOk':false,'msg':'分类添加失败！'})
        }
    })
});

//定义类别列表的路由          
router.get('/mangt', (req, res) => {
  //定义SQL语句
  let sqlStr = 'select t1.*,t2.cg_name as cg_fatherName from goodscategory as t1 LEFT JOIN goodscategory as t2 on t1.cg_fatherID = t2.cg_id order by cg_id desc';
  //执行SQL语句
  connection.query(sqlStr,(err,result)=>{
    if(err) throw err;
    res.send(result)
  })
})

//定义删除类别的路由
router.post('/del', (req, res) => {
    //接收数据
    let{cg_id} = req.body;
    //sql语句
    let sqlStr = 'delete from goodsCategory where cg_id=?';
    let paramsArr = [cg_id];
    //执行sql语句
    connection.query(sqlStr,paramsArr,(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({'isOk':true});
        }else{
            res.send({'isOk':false});
        }
    })
})

//定义编辑类别的路由
router.get('/edit', (req, res) => {
    //接收数据
    let{cg_id}=req.query;
    //定义SQL
    let sqlStr = 'select * from goodsCategory where cg_id=?';
    let paramsArr = [cg_id];
    //执行sql
    connection.query(sqlStr,paramsArr,(err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

//定义更新分类数据的路由
router.post('/save', (req, res)=>{
    //接收前端
    let {cg_fatherID, cg_name,cg_isEnable,cg_id } = req.body;
    //定义sql语句,更新数据
    let sqlStr = "update goodsCategory set cg_fatherID=?,cg_name=?,cg_isEnable=? where cg_id=?"
    //定义参数数组
    let paramsArr = [cg_fatherID,cg_name,cg_isEnable,cg_id];
    //执行语句，添加数据
    connection.query(sqlStr, paramsArr,(error, results)=>{
    console.log(results)
    if (results.affectedRows > 0) {
        res.send({ 'isOk': true, 'msg': '信息修改成功' })
    } else {
        res.send({ 'isOk': false, 'msg': '信息修改失败' })
    }
    // res.send("11111")
    });
});


module.exports = router;
