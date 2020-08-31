const express=require('express')
const connection=require('../../mysqlconnection')




const router=express.Router()

router.get("/Course",(req,res)=>{

    connection.query("select distinct(Name),CourseID from newcourse",(err,rows,fields)=>{
    if(!err){
        let mymap = new Map(); 
        unique = rows.filter(e => { 
            const val = mymap.get(e.Name); 
            if(val) { 
                    return false; 
            } 
            mymap.set(e.Name, e.CourseID); 
            return true; 
        });
         res.send(unique)
    }
    else{
        res.status(400)
        res.status({msg:"Error in fatching data"})
    }
    })
})


//Streme
router.get("/Streme",(req,res)=>{
    connection.query("select StremeID,Name from Streme",(err,rows,fields)=>{
    if(!err){
        let mymap = new Map(); 
        unique = rows.filter(e => {
            const val = mymap.get(e.Name); 
            if(val) { 
                    return false; 
            }
            mymap.set(e.Name, e.StremeID); 
            return true; 
        });
         res.send(unique)
    }
    else{
        res.status(400)
        res.status({msg:"Error in fatching data"})
    }
    })
})

//State
router.get("/State",(req,res)=>{
    connection.query("select Distinct(State) from class",(err,rows,fields)=>{
    if(!err){

         res.send(rows)
    }
    else{
        res.status(400)
        res.status({msg:"Error in fatching data"})
    }
    })
})


//Cityies
router.get("/City",(req,res)=>{
    connection.query("select Distinct(City) from class",(err,rows,fields)=>{
    if(!err){

         res.send(rows)
    }
    else{
        res.status(400)
        res.status({msg:"Error in fatching data"})
    }
    })
})


//city by state names

router.post("/CityName",(req,res)=>{

    const State=req.body.State

    let StateConcat="";

    State.map((c)=>{
            StateConcat+=`'${c}'`
        
        if(State[State.length-1]==c){
            StateConcat+=''
        }
        else{
            StateConcat+=','
        }
    })
    connection.query(`select ClassID,City from class where State IN(${StateConcat})`,(err,rows,fields)=>{
    if(!err){
        let mymap = new Map(); 
        unique = rows.filter(e => { 
            const val = mymap.get(e.City); 
            if(val) { 
                    return false; 
            } 
            mymap.set(e.City, e.ClassID); 
            return true; 
        });
         res.send(unique)
    }
    else{
        res.status(400)
        res.status({msg:"Error in fatching data"})
    }
    })
})

//private pro.. Type
router.get('/Type',(req,res)=>{

    connection.query('select distinct(Type) from Class',(err,rows,fields)=>{

        if(!err){
            res.send(rows)
        }
        else{
            res.send(400)
            res.send({
                msg:"Error in Fatching Data!"
            })
        }
    })
})











//Route for All Class
router.post('/AllClass',(req,res)=>{

    

        // const filteration={
        //     Course:[],
        //     State:[],
        //     City:[],
        //     Streme:[],  
        //     Subject:[],
        //     Type:[]1
        // }

    const filteration=req.body

   

        let SqlQuery=[]
        let Course,State,City,Streme,Subject,Type;

        SqlQuery.push('Select class.ClassID,class.Name,class.Contact,class.Email,class.City,Class.Town,class.State,classimage.Logo,classimage.Image,class.Varified,class.Type from class,classimage  ')


        if(filteration.Course.length!=0){            
            Course=''
            filteration.Course.map((c,index)=>{
                Course+=`'${c}'`
            if((filteration.Course.length-1)===index){
                Course+=''
            }
            else{
                Course+=','
            }
        })
            SqlQuery.push(` class.ClassID in(select ClassID from newcourse where Name IN(${Course})) `)
        }

     
         
        if(filteration.State.length!=0){
            State=''
            filteration.State.map((c,index)=>{
                State+=`'${c}'`
            if((filteration.State.length-1)===index){
                State+=''
            }
            else{
                State+=','
            }
        })
        SqlQuery.push(` class.ClassID in (select ClassID from class where State IN(${State})) `)
     }



        if(filteration.City.length!=0){
            City=''
            filteration.City.map((c,index)=>{
                City+=`'${c}'`
            if((filteration.City.length-1)===index){
                City+=''
            }
            else{
                City+=','
            }
        })
         SqlQuery.push(` class.ClassID in(select ClassID from class where City IN(${City})) `)
        }

        if(filteration.Streme.length!=0){
            Streme=''
            filteration.Streme.map((c,index)=>{
                Streme+=`'${c}'`
            if((filteration.Streme.length-1)===index){
                Streme+=''
            }
            else{
                Streme+=','
            }
        })
            SqlQuery.push(` class.ClassID in( select ClassID from Streme where Name in(${Streme})) `)

        }

        if(filteration.Subject.length!=0){
            Subject=''
            filteration.Subject.map((c,index)=>{
                Subject+=`'${c}'`
            if((filteration.Subject.length-1)===index){
                Subject+=''
            }
            else{
                Subject+=','
            }
        })
        SqlQuery.push(` class.ClassID in(select ClassID from Streme where StremeID in(select stremeID from subject where SubjectName in(${Subject}))) `)
        }

        if(filteration.Type.length!=0){
            Type=''
            filteration.Type.map((c,index)=>{
                Type+=`'${c}'`
            if((filteration.Type.length-1)===index){
                Type+=''
            }
            else{
                Type+=','
            }
        })

            SqlQuery.push(` class.ClassID in (select ClassID from class where Type in(${Type})) `)

        }

        SqlQuery.push('class.ClassID in(select ClassID from class where Status=1)')

        let sql=SqlQuery[0]        
       

        for (const index in SqlQuery) {
                if(index==1)
                {
                    sql+='where '
                    if(index==(SqlQuery.length-1))
                    {
                        sql+=SqlQuery[index]
                    }
                    else{
                        sql+=`(${SqlQuery[index]}`
                    }
                    continue
                }
                if( index==0){
                    continue
                }
                if(index==(SqlQuery.length-1)){
                    sql+=`) and ${SqlQuery[index]} `
                    continue
                }
                if(index==2)
                {
                    sql+=`or ${SqlQuery[index]}` 
                    continue  
                }

                if(index!=(SqlQuery.length-1))
                {
                   sql+=` or ${SqlQuery[index]}`
                   continue
                }
            
        }
    connection.query(sql,(err,rows,fields)=>{
        if(!err){
                  
            res.send(rows)
        }
        else{
            res.status(400)
            res.json({msg:err})
        }
        })

})




router.get('/Filter',(req,res)=>{

 
    connection.query('select * from class where Status=1',(err,rows,fields)=>{

        if(!err)
        {
          const   Data=rows
            connection.query('select distinct(Name),ClassID from newcourse',(err,rows,field)=>{

               if(!err){
                   
                Data.map((data,index)=>{
                  let  Courses=rows.filter((rows)=>rows.ClassID==data.ClassID)
                   Data[index]={...data,Course:Courses}
                   //finaldata.push(data)
                })
                connection.query('select distinct(Name),ClassID from streme',(err,rows,fields)=>{

                    if(!err)
                    {
                        Data.map((data,index)=>{
                            let  Streme=rows.filter((rows)=>rows.ClassID==data.ClassID)
                             Data[index]={...data,Streme:Streme}

                             //finaldata.push(data)
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

    let sql='SELECT Class.Name,Class.Email,class.Contact,classimage.Logo,classimage.Image'+
    ' From class Left Join classimage on class.ClassID=classimage.ClassID '+
    'where (class.Name Like "%'+search+'%" or class.City Like "%'+search+'%" or class.State '+ 
    ' Like "%'+search+'%") and class.Status=1'

    connection.query(sql,(err,rows,fields)=>{   
        if(!err)
        {
            res.send(rows)
        }
        else
        {
            res.status(400)
            res.send({meg:"Error in Fatching Data"})
        }
    })

})



module.exports=router