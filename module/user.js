module.exports=function(){
    let router=express.Router();
    router.use((req, res, next)=>{
        if(!req.session.uid){
            res.redirect('/login');
            return ;
        }
        next();
    });
    //退出登陆
    router.get('/logout',(req,res)=>{
        delete req.session.uid;
        delete req.session.username;
        delete req.session.header;
        res.redirect('/login');
    });
    router.get('/',(req,res)=>{
        let sql=` SELECT * FROM user WHERE uid=? `;
        mydb.query(sql,req.session.uid,(err,result)=>{
            res.render('user',{
                result:result[0],
                username:req.session.username,
                header:req.session.header
            }) 
        });
    });
    router.get('/information',(req,res)=>{
        let sql=` SELECT * FROM  user WHERE uid=? `;
        mydb.query(sql,req.session.uid,(err,result)=>{
            res.render('information',{
                result:result[0],
                username:req.session.username,
                header:req.session.header
            });
        });

    });
    router.post('/information',(req,res)=>{
        let q=req.body;
        let sql=` UPDATE user SET header = ?,info=?,sex=?,height=?,weight=?,age=? WHERE uid = ? LIMIT 1 `;
        let se=0;
        if(q.sex=='保密'){
            se=0;
        }else if(q.sex=="男"){
            se=1;
        }else{
            se=2;
        }
        mydb.query(sql,[q.myheader,q.info,se,q.height,q.weight,q.age,req.session.uid],(err,result)=>{
            if(err){
                console.log(err);
                res.json({r:'dberr'})
            }else{
                res.json({r:'ok'})
            }
        })
    });
    router.get('/plan',(req,res)=>{
        res.render('plan',{
            username:req.session.username,
            header:req.session.header
        })
    });
    router.get('/collection',(req,res)=>{
        let sql=` SELECT collection.*,course.* FROM collection LEFT JOIN course ON collection.cid=course.cid  WHERE collection.uid=? `
        mydb.query(sql,req.session.uid,(err,result)=>{
            let imgreg=/src=[\'\"]?([^\'\"]*\.gif)[\'\"]?/i; 
            for(let i=0;i<result.length;i++){
                let r = imgreg.exec(result[i].process); 
                if(r[1]){
                    result[i].imgpath = r[1];
                }             
            }
            res.render('collection',{
                result:result,
                username:req.session.username,
                header:req.session.header
            })
        }); 
    });
    router.post('/delcoll',(req,res)=>{
        sql=` DELETE  FROM  collection  WHERE  sid=? `
        console.log(req.body)
        mydb.query(sql,req.body.sid,(err,result)=>{
            if(err){
                res.json({r:'delerr'})
                console.log(err)
            }else{
                res.json({r:'delsuccess'})
            }
            
        })
    })

    return router;
};