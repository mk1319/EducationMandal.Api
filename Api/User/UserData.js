const express=require('express')
const connection=require('../../mysqlconnection')
const jwtencode=require('jwt-simple')
const router=express.Router()
const uuid=require("uniqid")


router.post('/NewUser',(req,res)=>{

        let Email,Name,Password,State,City,UserType,d,date
        Email=req.body.Email
        Password=uuid().slice(5)
        Name=req.body.Name
        State=req.body.State
        City=req.body.City
        UserType=req.body.UserType
        
        d=new Date()
        date=d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()


    connection.query(`select * from Register where Email='${Email}'`,(err,rows,fields)=>{
        if(!err){
            if(rows.length==0)
            { 
                let sql="insert into Register(Name,Email,Password,State,City,UserType,Date,SysyID) Values(?,?,?,?,?,?,?,?)"
                connection.query(sql,[Name,Email,Password,State,City,UserType,date,uuid('',Email.slice(0,-9)).slice(5)],(error,rows,fields)=>{
                   if(!error)
                   {
                       //Call function for email

                     res.send({msg:"Data Inserted Email is Send to You!!"})
                   }
                   else{
                       res.send({msg:"Error in inserting Data"})
                   }
                })
            }
            else{
                res.send({
                    msg:"Email Id Already Register!"
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

        connection.query(`select * from Register where Email=?`,[email],(err,rows,fields)=>{
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
            connection.query('Update Register set LastLogin=? where ID=?',[d,rows[0].ID])

                return res.send({Email:rows[0].Email,ID:rows[0].ID,User:rows[0].UserType,isLogin:true})
            }
            else{
                res.status(400)
                res.send({msg:"Error in Fatching Data!",isLogin:false})
            }
        })
})




router.post('/Forgatepassword',(req,res)=>{

    Email=req.body.Email
    Password=uuid().slice(5)

    connection.query('select * from Register where Email=?',[Email],(err,rows,fields)=>{

        if(!err)
        {
                if(rows.length!==0)
                {

                    connection.query('update Register set Password=? where Email=?',[Password,Email])   
                    //call function to send mail..
                    res.send({msg:"Email is Sent, With New Password"})
                }
                else{
                    res.send({msg:"Email is Not Reagister in Databse!"})
                }
        }
        else{
            res.send({msg:"Error in Updatation!!"})
        }
    })
})






//Bookmark Class
router.get('/BookmarkClass/:id',(req,res)=>{

    connection.query(`select ClassID from Bookmark where ID=${req.params.id};`,(err,rows,fields)=>{
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