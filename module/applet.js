module.exports=function(){
    let router=express.Router();
    router.get('/',(req,res)=>{
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
            },
            kclist:function(cb){
                let sql=` SELECT * FROM course `;
                var pd;
                if(req.query.qcname){
                    sql+=` WHERE equipment =? `
                    pd=req.query.qcname
                }
                if(req.query.bwname){
                    sql+=` WHERE positions =? `
                    pd=req.query.bwname
                }
                if(req.query.mdname){
                    sql+=` WHERE effect =? `
                    pd=req.query.mdname
                }
                mydb.query(sql,pd,(err,result)=>{
                    if(err){
                        console.log(err)
                        // res.json({r:'dberr'})
                    }else{
                        let imgreg=/src=[\'\"]?([^\'\"]*\.gif)[\'\"]?/i; 
                        for(let i=0;i<result.length;i++){
                            let r = imgreg.exec(result[i].process); 
                            if(r[1]){
                                result[i].imgpath = r[1];
                            }             
                        }    
                             
                    } 
                    cb(null, result);        
                })
            }
        },(err, results)=>{
            console.log(results)
            if(!Array.isArray(results.kclist)){
                results.kclist=[]
            }
            res.json({
                qclist:results.qclist,
                mdlist:results.mdlist,
                bwlist:results.bwlist,
                r:results.kclist
            });
        });

    });
    router.get('/details',(req,res)=>{
        let sql=` select * from course where cid=? limit 1 `;
        mydb.query(sql,req.query.cid,(err,result)=>{
            res.json({r:result[0]})
        });
    });
    return router;
}