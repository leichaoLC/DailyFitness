module.exports=function(){
    let router=express.Router();
    router.get('/coursedetails',(req,res)=>{
        let sql=` select * from course where cid=? limit 1 `;
        mydb.query(sql,req.query.cid,(err,result)=>{
            res.render('coursedetails',{
                result:result[0]
            })
        });
    });
    router.get('/courseoutline',(req,res)=>{
        let q=req.query;
        let sql=` SELECT * FROM equipment `
        if(q.qcname){

        }
        async.series({
            qclist:function (cb) {
                //器材
                let sql = ' SELECT * FROM equipment ';
                mydb.query(sql, (err, results)=>{
                    cb(null, results);
                });
            },
            mdlist:function (cb) {
                //目的
                let sql = ` SELECT * FROM effect `;
                mydb.query(sql, (err, result)=>{
                    cb(null, result);
                });
            },
            bwlist:function (cb) {
                //部位
                let sql = ` SELECT * FROM positions `
                mydb.query(sql, (err, result)=>{
                    cb(null, result);
                });
            }
        },(err, results)=>{
            res.render('courseoutline',{
                qclist:results.qclist,
                mdlist:results.mdlist,
                bwlist:results.bwlist,
            });
        });
    });
    router.post('/allcourse',(req,res)=>{
            //所有
            let q=req.body;
            let page=q.currentPage;
            let pagenum=1
            let sql=` SELECT * FROM course `;
            let pd;
            let tillte;
            if(q.name){
                sql+=` WHERE equipment=? `
                pd=q.name
                tillte=q.name+"分类"
            }
            if(q.bname){
                sql+=` WHERE position=? `
                pd=q.bname
                tillte=q.bname+"分类"
            }
            if(q.mname){
                sql+=` WHERE effect=? `
                pd=q.mname;
                tillte=q.mname+"分类" 
            }
            if(q.action){
                sql+=` WHERE concat(name,equipment,effect,position) LIKE '%${q.action}%' `;
                tillte="搜索"+q.action+"结果为:"
            }
            mydb.query(sql,pd,(err, result)=>{
                let imgreg=/src=[\'\"]?([^\'\"]*\.gif)[\'\"]?/i; 
                for(let i=0;i<result.length;i++){
                    let r = imgreg.exec(result[i].process); 
                    if(r[1]){
                        result[i].imgpath = r[1];
                    }             
                }
                let kwlist=[];
                //查询当前页数应该显示的记录
                let index=0;
                for(let i=(page-1)*pagenum;i<(page-1)*pagenum+pagenum;i++){
                    if(result[i]){
                    kwlist[index]=result[i];
                    index++;
                }
                }
                let allcount=result.length;
                res.json({result:kwlist,
                    allcount:allcount,
                    tillte:tillte
                })
            });
        

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
