module.exports=function(){
    let router=express.Router();
    var url;
    router.get('/',(req,res)=>{
        url=req.query.url
        console.log(url)
        res.render('login')
    });
    router.post('/',(req,res)=>{
        if(req.body.username=='admin'){
            let sql=` select * from admin where name=? `;
            mydb.query(sql,req.body.username,(err,result)=>{
                req.session.name = result[0].name;
                if(result[0].passwd=='tanjie123'){                  
                    res.json({r:'admin'});                                    
                }             
            })
            return;
        }
        let sql ='select * from user where username=? limit 1';
        mydb.query(sql, req.body.username, (err, result)=>{
            if(err){
                res.json({r:'db_error'});
                return;
            }
            //检查是否存在
            if(!result.length){
                res.json({r:'username_not_exist'});
                return;
            }
            if(result[0].statu){ 
                res.json({
                    r:'username_prohibit'
                })
                return;
            }
            //检查密码正确性
            if(md5(req.body.passwd)!= result[0].passwd){
                res.json({r:'passwd_error'});
                return;
            }
         //   SESSION处理          
            req.session.uid = result[0].uid;
            req.session.username = result[0].username;
            req.session.header =result[0].header;
            req.session.replynum =result[0].replynum;
            //更新登录信息
            let upsql = `UPDATE user SET logintime = ? WHERE uid = ? LIMIT 1`;
            mydb.query(upsql, [new Date().toLocaleString(), result[0].uid], (err, r)=>{
                console.log(url)
                if(err){
                    console.log(err);
                }else{
                    if(url){
                        res.json({r:"url",url:url});
                    }else{
                        res.json({r:'ok'});
                    }
                }
            });
        });
    });
    router.get('/register',(req,res)=>{
        res.render('register')
    });
    router.post('/reg',(req,res)=>{
        let q=req.body;
        let sql=` INSERT INTO user(username,passwd,regtime,logintime,ip,tel) VALUES(?,?,?,?,?,?) `;
        mydb.query(sql,[q.username,md5(q.passwd),new Date().toLocaleString(),new Date().toLocaleString(),req.ip,q.tel],(err,result)=>{
            if(err){
                res.json({r:'dberr'});
                console.log(err)
            }else{
                let sql ='select * from user where username=? limit 1';
                mydb.query(sql, q.username, (err, result)=>{
                    req.session.uid = result[0].uid;
                    req.session.username = result[0].username;
                    req.session.header =result[0].header;
                    req.session.replynum =result[0].replynum;
                res.json({r:'sucess'})
                })
            }        
        });
    });
    return router;
}