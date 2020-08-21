const express=require('express')
const connection=require('../../mysqlconnection')

const router=express.Router()




router.get('/',(req,res)=>{

    connection.query('select * from educationmandalblog',(err,rows,fields)=>{
        if(!err)
        {
            res.send(rows);
        }
        else{
            res.status(400)
            res.send({msg:"Error in Fatching Data!"})
        }
    })
})




module.exports=router