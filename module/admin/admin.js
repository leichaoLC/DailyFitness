module.exports=function(){
    let router=express.Router();
    router.use((req, res, next)=>{
        if(!req.session.name){
            res.redirect('/login');
            return ;
        }
        next();
    });
    //管理员页面
    router.get('/',(req,res)=>{
        res.render('admin/admin')
    });

    // router.get('/login',(req,res)=>{
    //     res.render('admin/login')
    // });
    router.get('/upcourse',(req,res)=>{
        async.series({
            qclist:function (cb) {
                let sql = ' SELECT * FROM equipment ';
                mydb.query(sql, (err, results)=>{
                    cb(null, results);
                });
            },
            mdlist:function (cb) {
                let sql = ` SELECT * FROM effect `;
                mydb.query(sql, (err, result)=>{
                    cb(null, result);
                });
            },
            bwlist:function (cb) {
                let sql = ` SELECT * FROM positions `
                mydb.query(sql, (err, result)=>{
                    cb(null, result);
                });
            }
        },(err, results)=>{
            res.render('admin/upcourse',{
                qclist:results.qclist,
                mdlist:results.mdlist,
                bwlist:results.bwlist
            });
        });
          
    });
    router.post('/upcourse',(req,res)=>{
        let q=req.body;
        console.log(q)
        let sql=` INSERT INTO course(equipment,effect,time,process,position,name) VALUES(?,?,?,?,?,?) `;
        mydb.query(sql,[q.qcname,q.mdname,new Date().toLocaleString(),q.bzname,q.bwname,q.jcname],(err,reslut)=>{
            if(err){
                res.json({r:'dberr'});
                console.log(err)
            }else{
                res.json({r:'sucess'})
            }
        })
    });
    router.get('/all',(req,res)=>{
        let sql=` SELECT * FROM course `;
        mydb.query(sql,(err,reslut)=>{
            let imgreg=/src=[\'\"]?([^\'\"]*\.gif)[\'\"]?/i; 
            for(let i=0;i<reslut.length;i++){
                let r = imgreg.exec(reslut[i].process); 
                if(r[1]){
                    reslut[i].imgpath = r[1];
                }             
            }
            res.render('admin/all',{
                reslut:reslut
            });
        })
    });
    router.get('/addclass',(req,res)=>{
        res.render('admin/addclass')
    });
    router.post('/addqc',(req,res)=>{
        let sql=` INSERT INTO equipment(name) VALUES(?) `;
        mydb.query(sql,req.body.qc,(err,reslut)=>{   
            if(err){
                res.json({r:'dberr'});
                console.log(err)              
            }else{
                res.json({r:'sucess'})
            }       
        });
    });
    router.post('/addmd',(req,res)=>{
        let sql=` INSERT INTO effect(ename) VALUES(?) `;
        mydb.query(sql,req.body.md,(err,reslut)=>{   
            if(err){
                res.json({r:'dberr'});
                console.log(err)              
            }else{
                res.json({r:'sucess'})
            }      
        });
    });
    router.post('/addbw',(req,res)=>{
        let sql=` INSERT INTO positions(pname) VALUES(?) `;
        mydb.query(sql,req.body.bw,(err,reslut)=>{   
            if(err){
                res.json({r:'dberr'});
                console.log(err)              
            }else{
                res.json({r:'sucess'})
            }       
        });
    });
    router.get('/usercomment',(req,res)=>{
        let sql=` SELECT * FROM comments `;
        mydb.query(sql,(err,reslut)=>{
            res.render('admin/usercomment',{reslut:reslut})
        })
    });
    router.post('/delcom',(req,res)=>{
        let sql=` DELETE  FROM  comments  WHERE  wid=? `
        console.log(req.body)
        mydb.query(sql,req.body.wid,(err,result)=>{
            if(err){
                res.json({r:'delerr'})
                console.log(err)
            }else{
                res.json({r:'delsuccess'})
            }
            
        })
    })
    router.get('/usercontrol',(req,res)=>{
        let sql=` SELECT * FROM user `;
        mydb.query(sql,(err,reslut)=>{
            res.render('admin/usercontrol',{reslut:reslut})
        })
    });

    router.post('/usercon',(req,res)=>{  
        var pd;
        console.log(req.body)
        let sql=` UPDATE user SET statu = ? WHERE uid = ? LIMIT 1 `;
        if(req.body.statu=='0'){
            pd=1
        }else{
            pd=0
        }
        mydb.query(sql,[pd,req.body.uid],(err,reslut)=>{
            if(err){
                res.json({r:'delerr'})
                console.log(err)
            }else{
                res.json({r:'success'})
            }
        })
    });
    router.get('/xgcourse',(req,res)=>{
        async.series({
            qclist:function (cb) {
                let sql = ' SELECT * FROM equipment ';
                mydb.query(sql, (err, results)=>{
                    cb(null, results);
                });
            },
            mdlist:function (cb) {
                let sql = ` SELECT * FROM effect `;
                mydb.query(sql, (err, result)=>{
                    cb(null, result);
                });
            },
            bwlist:function (cb) {
                let sql = ` SELECT * FROM positions `
                mydb.query(sql, (err, result)=>{
                    cb(null, result);
                });
            },
            course:function(cb){
                let sql=` SELECT * FROM course WHERE cid=? `;
                mydb.query(sql,req.query.cid,(err,reslut)=>{
                    cb(null, reslut[0]);
                })
            }
        },(err, results)=>{
            res.render('admin/upcourse',{
                qclist:results.qclist,
                mdlist:results.mdlist,
                bwlist:results.bwlist,
                course:results.course
            });
        });
    })
    return router;
}