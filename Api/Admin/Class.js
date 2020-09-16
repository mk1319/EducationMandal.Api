const express=require('express')
const connection=require('../../mysqlconnection')
const router=express.Router()




router.post('/',(req,res)=>{
 
    res.send(req.body)
      
})


module.exports=router


