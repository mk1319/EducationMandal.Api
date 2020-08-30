const express=require('express')
const connection=require('../../mysqlconnection')

const router=express.Router()


router.get('/Allstudent/:id',(req,res)=>{

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Accept");


    let sql=`select student.Name,student.Email,student.Contact,student.StudentID,student.UniqueID,student.Picture,batch.BatchName,student.Rate,batch.BatchID from student left join studentbatch
    on student.StudentID=studentbatch.StudentID  left join batch on batch.BatchID=studentbatch.BatchID  where student.ClassID=${req.params.id}`
    connection.query(sql,(err,rows,fields)=>{
        if(!err)
        {
            res.send(rows)
        }
        else{
            res.send({mes:"Error in Facthing Data"})
        }
    })
})

router.get('/Batch/:id',(req,res)=>{

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Accept");

    let sql=`select BatchName,BatchID from batch where ClassID=${req.params.id}`

    connection.query(sql,(err,rows,fields)=>{
        if(!err)
        {
            res.send(rows)
        }
        else{
            res.send({mes:"Error in Facthing Data"})
        }
    })
})




router.post('/NewStudent',(req,res)=>{

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST')

    let Email,Name,ClassID,BatchID
    Email=req.body.Email
    Name=req.body.Name
    ClassID=req.body.ClassID
    BatchId=req.body.BID
    
    
    d=new Date()
    date=d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()
    

connection.query(`select * from Student where Email='${Email}'`,(err,rows,fields)=>{

    if(!err){
        if(rows.length==0)
        { 
            let sql="insert into student(Name,Email,Date,StudentType,ClassId) Values(?,?,?,?,?)"
            connection.query(sql,[Name,Email,date,1,ClassID],(error,rows,fields)=>{
               if(!error)
               {
                connection.query("insert into studentbatch value(?,?)",[rows.insertId,BatchId],(err,rows,fields)=>{
                        if(!err)
                        {
                            res.send({mes:"Data Inserted."})
                        }
                        else{
                            res.send({mes:"Student Data inserted,But BatchId not Updated!!"})
                        }
                    
                })
                }
               else{
                res.send({msg:"Error in Inserting Data!"})
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


router.get('/AllTeacher/:id',(req,res)=>{

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Accept");


    let sql=`select teacher.Name,teacher.Email,teacher.Contact,teacher.TeacherID,teacher.UniqueID,Teacher.Picture,Teacher.Rate from teacher where ClassID=${req.params.id}`

    connection.query(sql,(err,rows,fields)=>{
        if(!err)
        {
            res.send(rows)
        }
        else{
            res.send({mes:"Error in Facthing Data"})
        }
    })
})



router.post('/NewTeacher',(req,res)=>{

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST')


    let Email,Name,ClassID
    Email=req.body.Email
    Name=req.body.Name
    ClassID=req.body.ClassID
    
    
    d=new Date()
    date=d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()
    

connection.query(`select * from teacher where Email='${Email}'`,(err,rows,fields)=>{

    if(!err){
        if(rows.length==0)
        { 
            let sql="insert into teacher(Name,Email,Date,ClassId) Values(?,?,?,?)"
            connection.query(sql,[Name,Email,date,ClassID],(error,rows,fields)=>{
               if(!error)
               {
                    res.send({meg:"Data Inserted."}) 
                }
               else{
                res.send({msg:"Error in Inserting Data!"})
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




//Update Student data
router.put('/UpdateStudent',(req,res)=>{

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST')

    console.log(req.body)

    Email=req.body.Email
    Name=req.body.Name
    StudentID=req.body.StudentID
    BatchID=req.body.BatchID
    

connection.query(`UPDATE student SET Name=?,Email =? WHERE StudentID=?`,[Name,Email,StudentID],(err,rows,fields)=>{

    if(!err){
        
            let sql=`UPDATE studentbatch SET BatchID=? WHERE StudentID=?`
 
            console.log(sql)
            connection.query(sql,[BatchID,StudentID],(error,rows,fields)=>{
               if(!error)
               {
                    res.send({mes:"Student Data Inserted!!"})   
               }
               else
               {
                    res.send({msg:"Error in Upadating Data!"})
               }
            })
    }
    else{
        res.send({msg:"Error in Upadatation of Data!"})
    }
})
})


//Update teacher

router.put('/UpdateTeacher',(req,res)=>{

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST')


    Email=req.body.Email
    Name=req.body.Name
    TeacherID=req.body.StudentID
    

connection.query(`UPDATE teacher SET Name=?,Email =? WHERE TeacherID=?`,[Name,Email,TeacherID],(err,rows,fields)=>{

    if(!err){
            res.send({mes:"Data Updated"})
    }
    else{
        res.send({msg:"Error in Upadatation of Data!"})
    }
})
})




router.post('/NewCourse',(req,res)=>{

        console.log(req.body)

        ClassID=req.body.ClassID
        Discription=req.params.Discription
        Name=req.body.Name
        TotalFess=req.body.TotalFess
        StartDate=req.body.StartDate
        EndDate=req.body.EndDate
        Duration=req.body.Duration
        TeachBy=req.body.TeachBy
        DiscountedAmount=req.body.DiscountedAmount


let sql=`insert into newcourse(ClassID,Name,Discription,TotalFess,StartDate,EndDate,Duration,TeachBy,DiscountedAmount)
value(?,?,?,?,?,?,?,?,?)`

console.log(sql)
connection.query(sql,[ClassID,Name,Discription,TotalFess,StartDate,EndDate,Duration,TeachBy,DiscountedAmount],(err,rows,fields)=>{

    if(!err){
            
        res.send({mes:"Data Inserted!!"})
    }
    else{
        res.send(err)
    }
})
})



module.exports=router