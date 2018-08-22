const fs= require('fs');
global.express = require('express');
const mysql = require('mysql');
global.ejs = require('ejs');
global.md5 = require('md5');
global.svgCaptcha = require('svg-captcha');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');
const server = express();


//设置模版引擎
server.engine('html', ejs.renderFile);
server.set('view engine', 'html');
server.set('views', 'view');
//数据库连接
global.mydb=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    port:3306,
    database:'dailyfitness'
})
mydb.connect();
//启用cookie parser，并设置签名密钥
let cookiesigned = 'dailyfitness';
server.use(cookieParser(cookiesigned));

//启用session相关的中间件
server.use(session({
    secret: cookiesigned,
    name: 'sessid',
    resave: false, //每次发起请求的时候，有效时间要不要重新及时
    saveUninitialized: true,
    cookie: {maxAge: 1800 * 1000}
}));
//设置中间件，接收post过来的数据；
server.use(bodyParser.urlencoded({
    extended:true
}));
//登录注册路由
server.use('/login',require('./module/login')()); 
// //用户个人中心路由
server.use('/user',require('./module/user')());
//管理员路由
server.use('/admin',require('./module/admin/admin')())

//静态资源托管
server.use(express.static('view'));
server.use((req,res)=>{
    res.send('你访问的页面不存在');
});
server.listen(81);





