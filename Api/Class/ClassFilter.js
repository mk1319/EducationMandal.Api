const express=require('express')
const fileUpload = require('express-fileupload')
const connection=require('../../mysqlconnection')




const router=express.Router()

//demo operation
router.get('/FilterOption',(req,res)=>{

    connection.query('select distinct(Name) from Newcourse; select Distinct(State) as Name from Class;select Distinct(City) as Name from Class; select Distinct(Name) from Stream;',(err,rows,fields)=>{
        if(!err)
        {
            res.send([{id:"1",title:"Course",Data:rows[0]},
                    {id:"2",title:"State",Data:rows[1]},
                    {id:"3",title:"City",Data:rows[2]},
                    {id:"4",title:"Stream",Data:rows[3]}])                
        }
        else{
            res.send({mes:"Error in Fatching Data"})
        }
    })
})


router.get('/Total',(req,res)=>{

    connection.query('select Count(*) as Total from Class;',(err,rows,fields)=>{
        if(!err)
        {
            res.send(rows[0])
        }
        else{
            res.send({mes:"Error in Fatching Data"})
        }
    })
})

router.get('/Filter/:start',(req,res)=>{

    let start=parseInt(req.params.start)


    connection.query('select Class.Name ,Class.Email,Class.ClassID,Class.Contact,Class.City,Class.Town,Class.State,Class.Type,Class.Varified,Classvisitor.Rate,Classvisitor.Visitor from Class left join Classvisitor on Class.ClassID=Classvisitor.ClassID where Class.Status=1 LIMIT ?,1',
        [start],(err,rows,fields)=>{

        if(!err)
        {
          const   Data=rows
            connection.query('select distinct(Name),ClassID from Newcourse ;',(err,rows,field)=>{

               if(!err){

                Data.map((data,index)=>{
                  let  Courses=rows.filter((rows)=>rows.ClassID==data.ClassID)
                   Data[index]={...data,Course:Courses}
                })
                res.send(Data)
            }
            else{
                res.status(400)
                res.send({msg:"Error in Fatching Data!!"})
            }
            })
        }
        else{
            res.send({msg:"Error in Fatching Data!!"})
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


//Filter for option grp

router.post('/FilterData',(req,res)=>{

    let course,stream,city,state,type

    course=req.body.Filter.Course.length?req.body.Filter.Course:['']
    stream=req.body.Filter.Stream.length?req.body.Filter.Stream:['']
    city=req.body.Filter.City.length?req.body.Filter.City:['']
    state=req.body.Filter.State.length?req.body.Filter.State:['']
    type=req.body.Filter.Type


    let Data=[]

    connection.query('Select ClassID from NewCourse where Name In (?);',[course],(err,rows,fields)=>{
        if(!err)
        {
            rows.filter((id)=>Data.push(id.ClassID))

            connection.query('Select ClassID from Stream where Name In (?)',[stream],(err,rows,fields)=>{
                if(!err)
                {
                    rows.filter((id)=>Data.push(id.ClassID))

                    connection.query('select ClassID from class where City In (?) or State In (?) or Type=?',
                                [city,state,type],(err,rows,fields)=>{
                        if(!err)
                        {
                            rows.filter((id)=>Data.push(id.ClassID))
                            
                            connection.query('select Class.Name ,Class.Email,Class.ClassID,Class.Contact,Class.City,Class.Town,Class.State,Class.Type,Class.Varified,Classvisitor.Rate,Classvisitor.Visitor from Class left join Classvisitor on Class.ClassID=Classvisitor.ClassID where Class.Status=1 and Class.ClassID In (?)',
                                [Data.length?Data:""],(err,rows,fields)=>{
                                if(!err) 
                                {

                                    Data=rows
                                    
                                    connection.query('select distinct(Name),ClassID from Newcourse ;',(err,rows,field)=>{

                                        if(!err){
                                            
                                         Data.map((data,index)=>{
                                           let  Courses=rows.filter((rows)=>rows.ClassID==data.ClassID)
                                            Data[index]={...data,Course:Courses}
                                         })

                                         res.send(Data)

                                        }
                                    })

                                    // res.send(rows)  
                                }
                            })
                        }
                    })
                }
            })
        }
        else{
            res.send(err)
        }


    })
})





















module.exports=router