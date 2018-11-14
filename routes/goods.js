
var express = require('express');
var router = express.Router();
// 引入conectMysql
var connection = require('./connectMysql');



/* GET users listing. */
//添加商品的路由
router.post('/add', function (req, res, next) {
    //接收数据
    let { cg_id, barcode, goodsname, goodsprice, marketprice, saleprice, stockNum, weigth, unit, promotion, discount, goodsDetails } = req.body;
    //定义sql语句
    let sqlStr = 'insert into goodstable(cg_id,barcode,goodsname,goodsprice,marketprice,saleprice,stockNum,weigth,unit,promotion,discount,goodsDetails) values(?,?,?,?,?,?,?,?,?,?,?,?)';
    let paramsArr = [cg_id, barcode, goodsname, goodsprice, marketprice, saleprice, stockNum, weigth, unit, promotion, discount, goodsDetails];
    connection.query(sqlStr, paramsArr, (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.send({ 'isOk': true, 'msg': '商品添加成功！ ' })
        } else {
            res.send({ 'isOk': false, 'msg': '商品添加失败！' })
        }
    })
});

//定义商品列表的路由          
router.get('/mangt', (req, res) => {
    //接收参数
    let { currentPage, pageSize, keywords, category } = req.query;
    //定义SQL语句
    let sqlStr = 'select t1.*,t2.cg_name FROM goodstable as t1 LEFT JOIN goodscategory as t2 on t1.cg_id=t2.cg_id where 1=1';
    //执行SQL语句,查询数据
    connection.query(sqlStr, (err, goodsList) => {
        if (err) throw err;
        //缓存数据库中数据的数量
        let total = goodsList.length;

        //判断是否有keywords或者category
        if (category.length > 0) {
            sqlStr += ` and t1.cg_id=${category}`
        };
        if (keywords.length > 0) {
            sqlStr += ` and (goodsname like '%${keywords}%' or barcode like '%${keywords}%')`
        };
        if (category.length > 0 || keywords.length > 0) {
            connection.query(sqlStr, (err, result) => {
                if (err) throw err;
                //缓存数据库中数据的数量
               total = result.length;
            });
        };
        //计算查询时应该跳过的数量，和截取数量
        let skip = (currentPage - 1) * pageSize;
        pageSize = parseInt(pageSize);
        //拼接SQL语句,查询当前的页数的数据
        sqlStr += ` limit ${skip},${pageSize}`;
        connection.query(sqlStr, (err, pagerList) => {
            if (err) throw err;
            res.send({ 'total': total, 'pagerList': pagerList })
        })
    });
})

//定义删除商品的路由
router.post('/del', (req, res) => {
    //接收数据
    let { cg_id } = req.body;
    //sql语句
    let sqlStr = 'delete from goodsCategory where cg_id=?';
    let paramsArr = [cg_id];
    //执行sql语句
    connection.query(sqlStr, paramsArr, (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.send({ 'isOk': true });
        } else {
            res.send({ 'isOk': false });
        }
    })
})

//定义编辑商品的路由
router.get('/edit', (req, res) => {
    // //接收数据
    // let { cg_id } = req.query;
    // //定义SQL
    // let sqlStr = 'select * from goodsCategory where cg_id=?';
    // let paramsArr = [cg_id];
    // //执行sql
    // connection.query(sqlStr, paramsArr, (err, result) => {
    //     if (err) throw err;
    //     res.send(result);
    // })
})

//定义更新商品数据的路由
router.post('/save', (req, res) => {
    // //接收前端
    // let { cg_fatherID, cg_name, cg_isEnable, cg_id } = req.body;
    // //定义sql语句,更新数据
    // let sqlStr = "update goodsCategory set cg_fatherID=?,cg_name=?,cg_isEnable=? where cg_id=?"
    // //定义参数数组
    // let paramsArr = [cg_fatherID, cg_name, cg_isEnable, cg_id];
    // //执行语句，添加数据
    // connection.query(sqlStr, paramsArr, (error, results) => {
    //     console.log(results)
    //     if (results.affectedRows > 0) {
    //         res.send({ 'isOk': true, 'msg': '信息修改成功' })
    //     } else {
    //         res.send({ 'isOk': false, 'msg': '信息修改失败' })
    //     }
    //     // res.send("11111")
    // });
});


module.exports = router;
