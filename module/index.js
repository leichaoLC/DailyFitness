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
    return router;
}
