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
