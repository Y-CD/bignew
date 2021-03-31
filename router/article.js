// 引入express包
const express = require('express');
const sql = require('../utils/sql.js');
const router = express.Router();
// 导入自己封装的连接数据库的模块
const conn = require('../utils/sql.js');
// 下面的一句代码是实现获取post请求携带的普通键值对形式的参数
router.use(express.urlencoded());

// 获取文章分类列表接口
router.get('/cates', (req, res) => {
    // 拼接sql语句
    const sqlStr = `select * from categories`;
    // console.log(sqlStr);
    // 执行sql
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ status: 1, message: '获取文章失败' });
            return;
        }
        // 查看获取的数据
        // console.log(result);
        res.json({ status: 0, message: '获取文章成功', data: result });
    });
});

// 新增文章分类接口
router.post('/addcates', (req, res) => {
    // 获取用户传入的参数
    // console.log(req.body);
    const { name, slug } = req.body;
    // 拼接sql语句  先查询要添加的分类存不存在
    const sqlStr = `select * from categories where name="${name}"`;
    // console.log(sqlStr);
    // 执行sql
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ status: 1, message: '服务器错误' });
            return;
        }
        // console.log(result);
        if (result.length > 0) {
            res.json({ status: 1, message: '你添加的类别已经存在' });
            return;
        }
        // 如果不存在
        // 拼接sql语句添加
        const sqlStr2 = `insert into categories (name,slug) values ("${name}","${slug}")`;
        // console.log(sqlStr2);
        // 执行sql
        conn.query(sqlStr2, (err, result) => {
            if (err) {
                res.json({ status: 1, message: '新增类别失败' });
            }
            res.json({ status: 0, message: '新增类别成功' });
        });
    });

});

// 根据id删除文章分类接口
router.get('/deletecate', (req, res) => {
    // 获取用户参入的参数
    // console.log(req.query);
    const { id } = req.query;
    // 拼接语句 先去查询要删除的类别存不存在
    const sqlStr = `delete from categories where id=${id}`;
    // console.log(sqlStr);
    // 执行sql
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ status: 1, message: '删除失败' });
            return;
        }
        res.json({ status: 0, message: '删除成功' });
    });
});

// 根据id获取文章分类信息接口
router.get('/getCatesById', (req, res) => {
    // 获取传入的id
    // console.log(req.query);
    const { id } = req.query;
    // 拼接语句
    const sqlStr = `select * from categories where id=${id}`;
    // console.log(sqlStr);
    // 执行sql
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ status: 1, message: '服务器错误' });
            return;
        }
        // console.log(result);
        if (result.length <= 0) {
            res.json({ status: 1, message: '文章分类不存在' });
            return;
        }
        res.json({ status: 0, message: '获取成功', data: result });
    });
});

// 根据id更新文章分类数据接口
router.post('/updatecate', (req, res) => {
    // 获取参数
    // console.log(req.body);
    const { id, name, slug } = req.body;
    // 拼接sql语句
    const sqlStr = `update categories set name="${name}",slug="${slug}" where id=${id}`;
    // console.log(sqlStr);
    // 执行sql
    conn.query(sqlStr, (err, result) => {
        // console.log(err);
        if (err) {
            res.json({ status: 1, message: '更新分类数据失败' });
            return;
        }
        // console.log(result);
        res.json({ status: 0, message: '更新分类数据成功' });
    });
});

// 导出路由中间件
module.exports = router;