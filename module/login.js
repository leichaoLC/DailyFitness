module.exports=function(){
    let router=express.Router();
    router.get('/',(req,res)=>{
        res.render('login')
    });
    router.get('/register',(req,res)=>{
        res.render('register')
    });
    router.post('/reg',(req,res)=>{
        console.log(req.body)
        let q=req.body;
        let sql=` INSERT INTO user(username,passwd,regtime,logintime,ip,tel) VALUES(?,?,?,?,?,?) `;
        mydb.query(sql,[q.username,q.passwd,new Date().toLocaleString(),new Date().toLocaleString(),req.ip,q.tel],(err,result)=>{
            if(err){
                res.json({r:'dberr'});
                console.log(err)
            }else{
                let sql=` SELECT * FROM user WHERE uid=? `
                // req.session.uid = result[0].uid;
                req.session.username =q.username;
                // req.session.header = result[0].header;
                res.json({r:'sucess'})
            }
            
        });
    });
    return router;
}