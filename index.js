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
const path = require('path');
global.async = require('async');

//图片上传的相关配置
var diskstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = './uploads/' + new Date().getFullYear() + '/' + (new Date().getMonth() + 1).toString().padStart(2, '0');
        //如果使用不存在的文件夹，会报错
        // uploads   2018  07 
        // 检查文件夹是否存在，如果不存在就创建
        let folderA = folder.split('/');
        let f = '.';
        for (let index = 1; index < folderA.length; index++) {
            f += '/' + folderA[index];
            //第一次：./uploads
            //第二次：./uploads/2018
            //第三次：./uploads/2018/07
            if (!fs.existsSync(f)) {
                fs.mkdirSync(f);
            }
        }
        cb(null, folder)
    },
    filename: function (req, file, cb) {
        let filename = new Date().valueOf() + '_' + Math.random().toString().substring(2, 8) + path.extname(file.originalname);
        cb(null, filename);
    }
});
var upload = multer({
    storage: diskstorage
});

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
server.post('/upload', upload.array('editimages'), (req, res) => {
    //获取根域名
    let hostname = req.headers.origin + '/';
    // req.files;
    let data = [];
    for (const img of req.files) {
        //追加上访问的域名，组成绝对路径
        data.push(hostname + img.path);
    }
    // data 是一个数组，返回若干图片的线上地址，这种返回的数据格式是编辑器要求的返回格式
    res.json({
        "errno": 0,
        "data": data
    });
});
//登录注册路由
server.use('/login',require('./module/login')()); 
// //用户个人中心路由
server.use('/user',require('./module/user')());
//管理员路由
server.use('/admin',require('./module/admin/admin')())
//前端页面路由
server.use('/index',require('./module/index')());

//静态资源托管
server.use(express.static('view'));
server.use('/uploads', express.static('uploads'));
server.use((req,res)=>{
    res.send('你访问的页面不存在');
});
server.listen(81);





