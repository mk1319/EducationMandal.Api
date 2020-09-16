const express=require('express')
const connection=require('../../mysqlconnection')




const router=express.Router()


router.get('/FilterOption',(req,res)=>{

    connection.query('select distinct(Name) from Newcourse; select Distinct(State) from Class;select Distinct(City) from Class; select Distinct(Name) from Stream;',(err,rows,fields)=>{
        if(!err)
        {
            res.send([rows[0],rows[1],rows[2],rows[3]])
        }
        else{
            res.send({mes:"Error in Fatching Data"})
        }
    })

})


router.get('/Filter',(req,res)=>{

 
    connection.query('select Class.Name ,Class.Email,Class.ClassID,Class.Contact,Class.City,Class.Town,Class.State,Class.Type,Class.Varified,Classvisitor.Rate,Classvisitor.Visitor from Class left join Classvisitor on Class.ClassID=Classvisitor.ClassID where Class.Status=1',(err,rows,fields)=>{

        if(!err)
        {
          const   Data=rows
            connection.query('select distinct(Name),ClassID from Newcourse ;',(err,rows,field)=>{

               if(!err){
                   
                Data.map((data,index)=>{
                  let  Courses=rows.filter((rows)=>rows.ClassID==data.ClassID)
                   Data[index]={...data,Course:Courses}
                })

                console.log(Data[0])
                connection.query('select distinct(Name),ClassID from Stream',(err,rows,fields)=>{

                    if(!err)
                    {
                        Data.map((data,index)=>{
                            let  Stream=rows.filter((rows)=>rows.ClassID==data.ClassID)
                             Data[index]={...data,Stream:Stream}

                          })
                          res.send(Data)

                    }
                    else{

                        return res.send({msg:"Error in Fatching Data!!"})

                    }

                })
            }
            else{
                res.status(400)
                res.send({msg:"Error in Fatching Data!!"})
            }
                


            })
        }
        else{

            res
        }


    })
})



//SearchBy Name etc..
router.post('/Search',(req,res)=>{

    const search=req.body.Search;

//       console.log(search.replace(/'/g,"\\'"))

    let sql='SELECT Class.ClassID, Class.Name,Class.City,Class.State,Class.Town,Class.Email,Class.Contact,Classimage.Logo,Classimage.Image, Class.Type,Classvisitor.Rate '+
    ' From Class Left Join Classimage on Class.ClassID=Classimage.ClassID left join classvisitor on Class.ClassID=classvisitor.ClassID  '+
    'where (Class.Name Like "%'+search+'%" or Class.City Like "%'+search+'%" or Class.State '+ 
    ' Like "%'+search+'%") and Class.Status=1'

    connection.query(sql,(err,rows,fields)=>{

        if(!err)
        {
          const   Data=rows
            connection.query('select distinct(Name),ClassID from Newcourse ;',(err,rows,field)=>{

               if(!err){
                   
                Data.map((data,index)=>{

                   let  Courses=rows.filter((rows)=>rows.ClassID==data.ClassID)

                   Data[index]={...data,Course:Courses}
                    
                })
                connection.query('select distinct(Name),ClassID from Stream',(err,rows,fields)=>{

                    if(!err)
                    {
                        Data.map((data,index)=>{
                            let  Stream=rows.filter((rows)=>rows.ClassID==data.ClassID)
                             Data[index]={...data,Stream:Stream}
                          })

                        res.send(Data)

                    }
                    else{

                        return res.send({msg:"Error in Fatching Data!!"})

                    }

                })
            }
            else{
                res.status(400)
                res.send({msg:"Error in Fatching Data!!"})
            }
                


            })
        }
        else{

            res
        }


    })
})



module.exports=router