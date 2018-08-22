module.exports=function(){
    let router=express.Router();
    
    router.get('/',(req,res)=>{
        let sql=` SELECT * FROM user WHERE uid=? `;
        mydb.query(sql,req.session.uid,(err,result)=>{
            let sql1=` SELECT did,uid,dishes,info,mainpic,addtime  FROM  dish WHERE uid=? `
            mydb.query(sql1,req.session.uid,(err,data)=>{
                res.render('user',{
                    username:req.session.username,
                    result:result[0],
                    data:data                  
                })
            })     

        });
    });
    return router;
};