const express=require('express')
const connection=require('../../mysqlconnection')

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
        
        console.log(date)

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