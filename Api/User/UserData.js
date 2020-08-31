const express=require('express')
const connection=require('../../mysqlconnection')
const jwtencode=require('jwt-simple')
const router=express.Router()



router.post('/NewUser',(req,res)=>{

        let Email,Name,Password,State,City,UserType,d,date
        Email=req.body.Email
        Password='sad'
        Name=req.body.Name
        State=req.body.State
        City=req.body.City
        UserType=req.body.UserType
        
        d=new Date()
        date=d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()


    connection.query(`select * from register where Email='${Email}'`,(err,rows,fields)=>{
        if(!err){
            if(rows.length==0)
            { 
                let sql="insert into register(Name,Email,Password,State,City,UserType,Date) Values(?,?,?,?,?,?,?)"
                connection.query(sql,[Name,Email,Password,State,City,UserType,date],(error,rows,fields)=>{
                   if(!error)
                   {
                     res.send(rows)
                   }
                   else{
                       console.log("err")
                   }
                })
            }
            else{
                res.send({
                    message:"Email Id Already Register!"
                })
            }
        }
        else{
            res.send({msg:"Error in Fatching Data!"})
        }
    })
})


router.post('/Login',(req,res)=>{
        let email=req.body.email
        let Password=req.body.Password

        connection.query(`select * from register where email=?`,[email],(err,rows,fields)=>{
            if(!err)
            {
                if(rows.length==0){
                       return res.send({isLogin:false,msg:"Email is not register!!"})
                }
                if(rows[0].Password!==Password){
                    return    res.send({msg:"Incorrect Password",isLogin:false})
                }
                d=new Date()
                date=d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()
            connection.query('Update register set LastLogin=? where ID=?',[d,rows[0].ID])

                return res.send({Email:rows[0].Email,ID:rows[0].ID,User:rows[0].UserType,isLogin:true})
            }
            else{
                res.status(400)
                res.send({msg:"Error in Fatching Data!",isLogin:false})
            }
        })
})










//Bookmark CLass
router.get('/BookmarkClass/:id',(req,res)=>{

    connection.query(`select ClassID from bookmark where ID=${req.params.id};`,(err,rows,fields)=>{
        if(!err)
        {
            res.send(rows)
        }
        else{
            res.status(400)
            res.send({msg:"Errow in Fatching Data!"})
        }
    })
})

module.exports=router