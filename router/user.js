// 引入express包
const express = require('express');
// 导入自己封装的连接数据库的模块
const conn = require('../utils/sql.js');
// 引入multer模块 接收文件
const multer = require('multer');

const router = express.Router();
// 下面的一句代码是实现获取post请求携带的普通键值对形式的参数
router.use(express.urlencoded());

// 精细化去设置，如何去保存文件
const storage = multer.diskStorage({
    // 保存在哪里
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    // 保存时，文件名叫什么
    filename: function (req, file, cb) {
        // console.log('file', file)
        // 目标： 新名字是原来的名字
        const fileName = file.originalname;
        cb(null, fileName)
    }
})
let upload = multer({ storage })

// 获取用户基本信息的接口
router.get('/userinfo', (req, res) => {
    // 获取用户传入的参数 get方式的参数在req.query中
    // console.log(req.query);
    const { username } = req.query;
    // 拼接sql语句
    const sqlStr = `select * from users where username="${username}"`;
    // console.log(sqlStr);
    // 执行sql
    conn.query(sqlStr, (err, result) => {
        // 错误
        if (err) {
            res.json({ status: 1, message: '获取用户信息失败！' });
            return;
        }
        // 成功
        // console.log(result);
        res.json({ status: 0, message: '获取用户信息成功', data: result });
    });
});

// 更新用户信息的接口
router.post('/userinfo', (req, res) => {
    // 获取用户传入的数据
    // console.log(req.body);
    const { id, nickname, email, userPic } = req.body;
    // 拼接sql语句
    const sqlStr = `update users set nickname="${nickname}", email="${email}", userPic="${userPic}" where id=${id}`;
    // 执行sql
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ status: 1, message: '修改用户信息失败' });
            return;
        }
        res.json({ status: 0, message: '修改用户信息成功' });
    });
});

// 上传头像接口
router.post('/uploadPic', upload.single('file_data'), (req, res) => {
    const { id } = req.body;
    // 获取上传的文件信息 文件信息保存在req.file 里面
    // console.log(req.file);
    // 成功后根据id修改用户的头像
    // 拼接sql语句
    const sqlStr = `update users set userPic="http://127.0.0.1:8080/uploads/${req.file.originalname}" where id=${id}`;
    // console.log(sqlStr);
    // 执行sql
    conn.query(sqlStr, (err, result) => {

        if (err) {
            res.json({ status: 1, message: '服务器错误' });
            return;
        }

    });
    // 上传成功
    res.json({ status: 0, message: '上传图片成功', src: 'http://127.0.0.1:8080/uploads/' + req.file.originalname });
});

// 重置密码接口
router.post('/updatepwd', (req, res) => {
    // 获取用户传入的参数
    // console.log(req.body);
    const { id, oldPwd, newPwd } = req.body;
    // 拼接sql语句 查询用户的旧密码是否正确
    const sqlStr = `select password from users where id=${id}`;
    // console.log(sqlStr);
    // 执行sql
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ status: 1, message: '服务器错误' });
            return;
        }
        // console.log(result[0].password); // 获取到旧密码
        // 判断用户的旧密码是否相等
        if (result[0].password != oldPwd) {
            res.json({ status: 1, message: '你输入的旧密码不正确' });
            return;
        }
        // 拼接sql语句去修改密码
        const sqlStr2 = `update users set password="${newPwd}" where id=${id}`;
        // console.log(sqlStr2);
        // 执行sql修改
        conn.query(sqlStr2, (err, result) => {
            if (err) {
                res.json({ status: 1, message: '修改密码失败' });
            }
            res.json({ status: 0, message: '修改密码成功' });
        });
    });
});

// 导出路由中间件
module.exports = router;