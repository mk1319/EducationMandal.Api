const express=require('express')
const connection=require('../../mysqlconnection')
const router=express.Router()


router.post('/Login',(req,res)=>{
    let email=req.body.Email
    let Password=req.body.Password

    connection.query(`select * from Admin where Email=?`,[email],(err,rows,fields)=>{
        if(!err)
        {
            if(rows.length==0){
                   return res.send({isLogin:false,msg:"Email is not register!!"})
            }
            if(rows[0].Password!==Password){
                return    res.send({msg:"Incorrect Password",isLogin:false})
            }

            return res.send({Email:rows[0].Email,isLogin:true,Name:rows[0].Name,msg:"Login Sucessful"})
        }
        else{
            res.status(400)
            res.send({msg:"Error in Fatching Data!",isLogin:false})
        }
    })
})


router.get('/AllClass',(req,res)=>{
 
        connection.query('select Class.Name as name,Class.Contact as contact,Class.City as city,Class.Status as status,Class.Type as type,Class.Email as email,Class.ClassID as id,Classvisitor.Visitor as count from Class left join Classvisitor on class.ClassID=Classvisitor.ClassID',(err,rows,fileds)=>{
                if(!err)
                {
                    res.send(rows)
                }
                else
                {
                    res.send({msg:"Error in Fatching Data"})
                }
        })
      
})

router.post('/visibility',(req,res)=>{

    let id=req.body.id
    let status=req.body.status?0:1
 
    connection.query('Update Class set Status=? where ClassID=?',[status,id],(err,rows,field)=>{
            if(!err){
                res.send({msg:"Status Changed"})
            }
            else
            {
                res.send({msg:"Error in Fatching Data"})
            }
    })
})

module.exports=router