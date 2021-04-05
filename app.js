// 引入express包创建服务器
const express = require('express');
// 引入中间件cors解决跨域问题
const cors = require('cors');
// 引入express-jwt 实现token验证功能
const jwt = require('express-jwt');

// 初始化
const server = express();
// 使用cors
server.use(cors());

// 静态托管文件
server.use('/uploads', express.static('uploads'));

// server.use(jwt().unless());
// jwt() 用于解析token，并将 token 中保存的数据 赋值给 req.user
// unless() 约定某个接口不需要身份认证
server.use(jwt({
    secret: 'gz61', // 生成token时的 钥匙，必须统一
    algorithms: ['HS256'] // 必填，加密算法，无需了解
}).unless({
    path: ['/api/login', '/api/reguser', /^\/index\/.*/, /^\/uploads\/.*/] // 除了这两个注册和登录接口，还有请求图片的接口，其他都需要认证
}));

// 引入接口中间件
const apiRouter = require('./router/api.js');
const userRouter = require('./router/user.js');
const articleRouter = require('./router/article.js');
const frontRouter = require('./router/front.js');
// 使用
// 注册登录接口
server.use('/api', apiRouter);
// 用户信息接口
server.use('/my', userRouter);
// 文章类别接口
server.use('/my/article', articleRouter);
// 前台接口数据
server.use('/index', frontRouter);

// 统一处理 没有token登录的情况 返回401错误
server.use((err, req, res, next) => {
    // console.log('有错误', err)
    if (err.name === 'UnauthorizedError') {
        // res.status(401).send('invalid token...');
        res.status(401).json({ code: 401, message: '身份认证失败！' });
    }
});

// 启动服务器
server.listen(8080, () => { console.log('服务器已经就绪'); });