// 引入express包
const express = require('express');
const router = express.Router();
// 引入jsonwebtoken 模块 生成token
const jwt = require('jsonwebtoken');

// 引入封装好的连接数据库模块
const conn = require('../utils/sql.js');
// 下面的一句代码是实现获取post请求携带的普通键值对形式的参数
router.use(express.urlencoded());

// 注册接口
router.post('/reguser', (req, res) => {
    // 获取用户传入的参数 在body中
    // console.log(req.body);
    const { username, password } = req.body;
    // 拼接查询语句 注册之前先查询用户名是否存在
    const sqlStr2 = `select username from users where username="${username}"`;
    // console.log(sqlStr2);
    // 执行sql  
    conn.query(sqlStr2, (err, result) => {
        // console.log(err);
        if (err) {
            res.json({ status: 1, message: '服务器错误' });
            return;
        }
        // console.log(result);
        // 判断 如果result的长度大于0 就是用户名已经存在
        if (result.length > 0) {
            res.json({ status: 1, message: '用户名已经存在' });
            return;
        }
        // 拼接sql语句
        const sqlStr = `insert into users (username,password) values ("${username}","${password}")`;
        // console.log(sqlStr);
        conn.query(sqlStr, (err, result) => {
            if (err) {
                res.json({ status: 1, message: '注册失败' });
                return;
            }
            res.json({ status: 0, message: '注册成功' });
        });
    });

});

// 登录接口
router.post('/login', (req, res) => {
    // 获取用户传入的参数
    // console.log(req.body);
    const { username, password } = req.body;
    // 拼接sql语句 查询 用户输入的用户名是否存在 密码是否正确
    const sqlStr = `select username, password from users where username="${username}" and password="${password}"`;
    // console.log(sqlStr);
    // 执行sql
    conn.query(sqlStr, (err, result) => {
        // console.log(err);
        if (err) {
            res.json({ status: 1, message: '登录失败' });
            return;
        }
        console.log(result);
        // 判断查询到的用户名或者密码存不存在
        if (result.length > 0) {
            // 调用生成 token 的方法 第二个参数是秘钥 验证的时候要用 第三个参数是token的有效时间 单位是秒
            const tokenStr = jwt.sign({ name: username }, 'gz61', { expiresIn: 2 * 60 * 60 });
            const token = 'Bearer ' + tokenStr
            res.json({ status: 0, message: '登录成功', token });
        } else if (result) {
            res.json({ status: 1, message: '登录失败，用户名不存在，或者密码不正确' });
        }
    });
});

// 导出路由中间件
module.exports = router;