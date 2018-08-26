module.exports=function(){
    let router=express.Router();
    router.get('/coursedetails',(req,res)=>{
        let sql=` select * from course where cid=2 limit 1 `;
        mydb.query(sql,(err,result)=>{
            res.render('coursedetails',{
                result:result[0]
            })
        });
    });
    router.get('/courseoutline',(req,res)=>{
        res.render('courseoutline')
    });
    router.get('/find',(req,res)=>{
        let sql=` select * from find `;
        mydb.query(sql,(err,result)=>{
            res.render('find',{result:result})
        })    
    });
    router.post('/fabu',(req,res)=>{
        let sql=` INSERT INTO find(mainpic,content,times,uid,username) VALUES(?,?,?,?,?) `;
        if(!req.session.uid){
            res.json({r:'notlogin'})
            return;
        }
        mydb.query(sql,[req.body.imageUrl,req.body.desc,new Date().toLocaleString(),req.session.uid,req.session.username],(err,result)=>{
            if(err){
                res.json({r:'dberr'});
                console.log(err)
            }else{
                res.json({r:'ok'})
            }
        })
    });
    router.post('/comment',(req,res)=>{
        let sql=` SELECT comments.*,find.*,user.header FROM find LEFT JOIN comments ON comments.fid=find.fid LEFT JOIN user ON comments.uid=user.uid  WHERE find.fid=? `;
        mydb.query(sql,req.body.fid,(err,result)=>{
            if(err){
                res.json({r:'dberr'});
                console.log(err)
            }else{
                res.json({data:result})
            }
        }) 
    });
    router.post('/commented',(req,res)=>{
        let sql=` INSERT INTO comments(fid,commen,daten,uid,commentator) VALUES(?,?,?,?,?) `;
        if(!req.session.uid){
            res.json({r:'notlogin'})
            return;
        };
        mydb.query(sql,[req.body.fid2,req.body.comment,new Date().toLocaleString(),req.session.uid,req.session.username],(err,result)=>{
            if(err){
                res.json({r:'dberr'});
                console.log(err)
            }else{
                let sql=` SELECT comments.*,user.header FROM comments LEFT JOIN user ON comments.uid=user.uid  WHERE comments.fid=? `;
                mydb.query(sql,req.body.fid2,(err,result)=>{
                    if(err){
                        res.json({r:'dberr'});
                        console.log(err)
                    }else{
                        res.json({data:result,r:'ok'})
                    }
                }) 
            }

        });
    });
    router.post('/reply',(req,res)=>{
        let sql=` INSERT INTO comments(fid,commen,daten,uid,commentator,respondent) VALUES(?,?,?,?,?,?) `;
        if(!req.session.uid){
            res.json({r:'notlogin'})
            return;
        };
        mydb.query(sql,[req.body.fid3,req.body.value,new Date().toLocaleString(),req.session.uid,req.session.username,req.body.wid],(err,result)=>{
            if(err){
                res.json({r:'dberr'});
                console.log(err)
            }else{
                let sql=` SELECT comments.*,user.header FROM comments LEFT JOIN user ON comments.uid=user.uid  WHERE comments.fid=? `;
                mydb.query(sql,req.body.fid3,(err,result)=>{
                    if(err){
                        res.json({r:'dberr'});
                        console.log(err)
                    }else{
                        let sql1=` UPDATE user SET replynum =replynum+1  WHERE username = ? LIMIT 1`;
                        mydb.query(sql1,req.body.wid,(err,rt)=>{
                            res.json({data:result,r:'ok'});
                        })
                    }
                })
            }
        });
    });
    return router;
}
