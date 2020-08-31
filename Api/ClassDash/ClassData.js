const express=require('express')
const connection=require('../../mysqlconnection')

const router=express.Router()


router.get('/Allstudent/:id',(req,res)=>{

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

//Create Batch.
router.post('/CreateBatch',(req,res)=>{
    res.send('Creating on process')
})









router.get('/Batch/:id',(req,res)=>{

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



//Create teacher login .
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



//Login Router



router.post('/Login',(req,res)=>{
    let email=req.body.email
    let Password=req.body.Password

    connection.query(`select * from classlogin where email=?`,[email],(err,rows,fields)=>{
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
            connection.query('Update classlogin set LastLogin=? where AccessID=?',[d,rows[0].AccessID])

            return res.send({Email:rows[0].Email,ID:rows[0].ClassID,User:rows[0].UserType,Name:rows[0].Name,AccessID:rows[0].AccessID,isLogin:true})
        }
        else{
            res.status(400)
            res.send({msg:"Error in Fatching Data!",isLogin:false})
        }
    })
})





//New User for DashBoard Login only class owner can do that.


router.post('/NewLogin',(req,res)=>{

    
    Email=req.body.Email
    Contact=req.body.Contact
    Name=req.body.Name
    UserType=req.body.UserType
    ClassID=req.body.ClassID
    
    d=new Date()
    date=d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()


connection.query(`select * from classlogin where Email='${Email}'`,(err,rows,fields)=>{
    if(!err){
        if(rows.length==0)
        { 
            let sql="insert into classlogin(ClassID,Name,Email,Contact,UserType,Date) Values(?,?,?,?,?,?)"
            connection.query(sql,[ClassID,Name,Email,Contact,UserType,date],(error,rows,fields)=>{
               if(!error)
               {
                 res.send(rows)
               }
               else{
                   res.send({msg:"Fatching Error!!"})
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









module.exports=router