const express=require('express')
const connection=require('../../mysqlconnection')
const uuid=require('uniqid')
const fs=require('fs')



const router=express.Router()


router.get('/AllStudent/:id',(req,res)=>{



    let sql=`select Student.Name,Student.Email,Student.Contact,Student.StudentID,Student.UniqueID,Student.Picture,batch.BatchName,Student.Rate,batch.BatchID from Student left join Studentbatch
    on Student.StudentID=Studentbatch.StudentID  left join batch on batch.BatchID=Studentbatch.BatchID  where Student.ClassID=${req.params.id}`
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
    

    Name=req.body.CourseName
    BacthName=req.body.BacthName
    Term=req.body.Term
    ClassID=req.body.ClassID

    connection.query('insert into Batch(CourseName,BatchName,Term,ClassID) value(?,?,?,?)',[Name,BacthName,Term,ClassID],(err,rows,fields)=>{
        if(!err)
        {
            res.send({msg:"Batch Created    "})
        }
        else{
            res.send({mes:"Error in Inserting of Data"})
        }
    })

})









router.get('/Batch/:id',(req,res)=>{

    let sql=`select BatchName,BatchID from Batch where ClassID=${req.params.id}`

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

    let Email,Name,ClassID,BatchID
    Email=req.body.Email
    Name=req.body.Name
    ClassID=req.body.ClassID
    BatchId=req.body.BID
    UniqueID=uuid('',Email.slice(0,-9)).slice(5)
    
    d=new Date()
    date=d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()
    

connection.query(`select * from Student where Email='${Email}'`,(err,rows,fields)=>{

    if(!err){
        if(rows.length==0)
        { 
            let sql="insert into Student(Name,Email,Date,StudentType,ClassId,UniqueID) Values(?,?,?,?,?,?)"
            connection.query(sql,[Name,Email,date,1,ClassID,UniqueID],(error,rows,fields)=>{
               if(!error)
               {
                connection.query("insert into Studentbatch value(?,?)",[rows.insertId,BatchId],(err,rows,fields)=>{
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


    let sql=`select Teacher.Name,Teacher.Email,Teacher.Contact,Teacher.TeacherID,Teacher.UniqueID,Teacher.Picture,Teacher.Rate from Teacher where ClassID=${req.params.id}`

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



//Create Teacher login .
router.post('/NewTeacher',(req,res)=>{

    let Email,Name,ClassID
    Email=req.body.Email
    Name=req.body.Name
    ClassID=req.body.ClassID
    UniqueID=uuid('',Email.slice(0,-9)).slice(5)

    
    d=new Date()
    date=d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()
    

connection.query(`select * from Teacher where Email='${Email}'`,(err,rows,fields)=>{

    if(!err){
        if(rows.length==0)
        { 
            let sql="insert into Teacher(Name,Email,Date,ClassId) Values(?,?,?,?)"
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


    console.log(req.body)

    Email=req.body.Email
    Name=req.body.Name
    StudentID=req.body.StudentID
    BatchID=req.body.BatchID
    

connection.query(`UPDATE Student SET Name=?,Email =? WHERE StudentID=?`,[Name,Email,StudentID],(err,rows,fields)=>{

    if(!err){
        
            let sql=`UPDATE Studentbatch SET BatchID=? WHERE StudentID=?`
 
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


//Update Teacher

router.put('/UpdateTeacher',(req,res)=>{


    Email=req.body.Email
    Name=req.body.Name
    TeacherID=req.body.StudentID
    

connection.query(`UPDATE Teacher SET Name=?,Email =? WHERE TeacherID=?`,[Name,Email,TeacherID],(err,rows,fields)=>{

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


let sql=`insert into Newcourse(ClassID,Name,Discription,TotalFess,StartDate,EndDate,Duration,TeachBy,DiscountedAmount)
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

    connection.query(`select * from Classlogin where Email=?`,[email],(err,rows,fields)=>{
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
            connection.query('Update Classlogin set LastLogin=? where AccessID=?',[d,rows[0].AccessID])

            return res.send({Email:rows[0].Email,ID:rows[0].ClassID,User:rows[0].UserType,Name:rows[0].Name,AccessID:rows[0].AccessID,isLogin:true})
        }
        else{
            res.status(400)
            res.send({msg:"Error in Fatching Data!",isLogin:false})
        }
    })
})





//New User for DashBoard Login only Class owner can do that.


router.post('/NewLogin',(req,res)=>{

    
    Email=req.body.Email
    Contact=req.body.Contact
    Name=req.body.Name
    UserType=req.body.UserType
    Password=uuid().slice(5)
    ClassID=req.body.ClassID
    
    d=new Date()
    date=d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()


connection.query(`select * from Classlogin where Email='${Email}'`,(err,rows,fields)=>{
    if(!err){
        if(rows.length==0)
        { 
            let sql="insert into Classlogin(ClassID,Name,Email,Contact,Password,UserType,Date) Values(?,?,?,?,?,?,?)"
            connection.query(sql,[ClassID,Name,Email,Contact,Password,UserType,date],(error,rows,fields)=>{
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


router.post('/Forgatepassword',(req,res)=>{

    Email=req.body.Email
    Password=uuid().slice(5)

    connection.query('select * from Classlogin where Email=?',[Email],(err,rows,fields)=>{

        if(!err)
        {

                if(rows.length!==0)
                {

                    connection.query('update Classlogin set Password=? where Email=?',[Password,Email])   
                    //call function to send mail..
                    res.send({msg:"Email is Sent to With New Password"})
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





//Upload Class Logo

router.post('/UploadLogo/:id', (req, res) => {

    const file = req.files.file;
    const ClassID=req.params.id

    
    connection.query('select Logo  from  Classimage where ClassID=? ',[ClassID],(err,rows,fields)=>{
          
       if (req.files === null) {
         return res.status(400).json({ msg: 'No file uploaded' });
       }
     
       
       file.name=`${uuid()}${ClassID}.${file.name.split('.').pop()}`
     
       file.mv(`${__dirname.split('\\').slice(0,-3).join('\\')}/public/assest/Class/Logo/${file.name}`, err =>{
        console.log(__dirname.split('\\').slice(0,-3))

         if (err) {
           return res.send({msg:"File not uploded"});
         }


         if(rows.length===0)
         {
            connection.query('insert into Classimage(Logo,ClassID) value(?,?)',[file.name,ClassID])
            return res.json({ fileName: file.name, filePath:`${file.name}`});
         }

         fs.unlink(`${__dirname.split('\\').slice(0,-3).join('\\')}/public/assest/Class/Logo/${rows[0].Logo}`, function (err) {});

         connection.query('update Classimage set Logo=? where ClassID=?',[file.name,ClassID])



         res.json({ fileName: file.name, filePath: `/uploads/${file.name}`});
       });

    })
  });


//Class Image

router.post('/UploadImage/:id', (req, res) => {

    const file = req.files.file;
    const ClassID=req.params.id

    
    connection.query('select Image  from  Classimage where ClassID=? ',[ClassID],(err,rows,fields)=>{
          
       if (req.files === null) {
         return res.status(400).json({ msg: 'No file uploaded' });
       }
     
       
       file.name=`${uuid()}${ClassID}.${file.name.split('.').pop()}`
     
       file.mv(`${__dirname.split('\\').slice(0,-2).join('\\')}/assest/Class/Image/${file.name}`, err =>{

        console.log(__dirname.split('\\'))

         if (err) {
           return res.send({msg:"File not uploded"});
         }


         if(rows.length===0)
         {
            connection.query('insert into Classimage(Image,ClassID) value(?,?)',[file.name,ClassID])
            return res.json({ fileName: file.name, filePath:`${file.name}`});
         }

         fs.unlink(`${__dirname.split('\\').slice(0,-2).join('\\')}/assest/Class/Image/${rows[0].Logo}`, function (err) {});

         connection.query('update Classimage set Image=? where ClassID=?',[file.name,ClassID])



         res.json({ fileName: file.name, filePath: `/uploads/${file.name}`});
       });

    })
  });




module.exports=router