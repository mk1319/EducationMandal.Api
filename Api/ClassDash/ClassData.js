const express=require('express')
const connection=require('../../mysqlconnection')
const uuid=require('uniqid')
const fs=require('fs')



const router=express.Router()

//Add category
router.post('/NewCategory/:id',(req,res)=>{

    let sql="insert into Stream(ClassID,Name,TotalFess) value(?,?,?)";

    connection.query(sql,[req.params.id,req.body.Name,req.body.TotalFess],(err,rows,fields)=>{
        if(!err)
        {
            res.send({msg:"New Catergory Added Successfully."})
        }
        else{
            res.send({msg:"Error During insertaion."})
        }
    })
})


//Select All Category
router.get('/AllCategory/:id',(req,res)=>{

    let sql="Select StreamID,Name,TotalFess from Stream;";

    connection.query(sql,(err,rows,fields)=>{
        if(!err)
        {
            res.send(rows)
        }
        else{
            res.send({msg:"Error in Fatching Data!"})
        }
    })
})

//Delete Category
router.post('/DeleteCategory/:ClassID',(req,res)=>{

    let sql="Delete from Stream where StreamID=? and ClassID=?";
    connection.query("delete from subject where StreamID=?",[req.body.ID],(err,rows,fields)=>{
        if(!err)
        {
            connection.query(sql,[req.body.ID,req.params.ClassID],(err,rows,fields)=>{
                if(!err)
                {
                    res.send({msg:"Data Deleted!"})
                }
                else{
                    res.send(err)
                }
            })
        }
    })
})


//Add Course 
router.post('/NewSingleCategory',(req,res)=>{

    let sql="insert into subject(StreamID,Name,Description,Fess,TeacherName) value(?,?,?,?,?)";

    connection.query(sql,[req.body.StreamID,req.body.Name,req.body.Description,req.body.Fess,req.body.TeacherName],(err,rows,fields)=>{
        if(!err)
        {
            res.send({msg:"Sub Category Added Successfully."})
        }
        else{
            res.send(err)
        }
    })
})



//Select All SubCategory
router.get('/AllSubCategory/:id',(req,res)=>{

    let sql="Select * from Subject;";

    connection.query(sql,(err,rows,fields)=>{
        if(!err)
        {
            res.send(rows)
        }
        else{
            res.send({msg:"Error in Fatching Data!"})
        }
    })
})


//Delete SubCategory
router.post('/DeleteSubCategory',(req,res)=>{

    let sql="Delete from Subject where SubjectID=?";
    connection.query(sql,[req.body.ID],(err,rows,fields)=>{
            if(!err)
            {
                res.send({msg:"Data Deleted!"})
            }
            else
            {
                res.send(err)
            }
    })
})









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




//select All Teacher
router.get('/AllTeacher/:id',(req,res)=>{

    let sql='Select Name,ClassID,TeacherID,Email from Teacher where ClassID=?'

    connection.query(sql,[req.params.id],(err,rows,fields)=>{
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

connection.query(`select * from Teacher where Email='${Email}'`,(err,rows,fields)=>{

    if(!err){
        if(rows.length==0)
        { 
            let sql="insert into Teacher(Name,Email,UniqueID,ClassId) Values(?,?,?,?)"
            connection.query(sql,[Name,Email,UniqueID,ClassID],(error,rows,fields)=>{
               if(!error)
               {
                    res.send({msg:"Data Inserted."}) 
                }
               else{
                res.send({msg:"Error in Inserting Data!"})
               }
            })
        }
        else{
            res.send({
                msg:"Email id already register!"
            })
        }
    }
    else{
        res.send({msg:"Error in Fatching Data!"})
    }
})
})



//Delete Teacher Record 
router.post('/DeleteFaculty',(req,res)=>{

    let sql='Delete from Teacher where TeacherID=?'

    connection.query(sql,[req.body.id],(err,rows,fields)=>{
        if(!err)
        {
            res.send({msg:"Data Deleted."})
        }
        else{
            res.send({mes:"Error in Facthing Data"})
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





  router.get('/city',(req,res)=>{

    res.send([
        {
            "city": "Mumbai", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "12691836", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "18.987807", 
            "lng": "72.836447", 
            "population": "18978000"
        }, 
        {
            "city": "Delhi", 
            "admin": "Delhi", 
            "country": "India", 
            "population_proper": "7633213", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "28.651952", 
            "lng": "77.231495", 
            "population": "15926000"
        }, 
        {
            "city": "Kolkata", 
            "admin": "West Bengal", 
            "country": "India", 
            "population_proper": "4631392", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "22.562627", 
            "lng": "88.363044", 
            "population": "14787000"
        }, 
        {
            "city": "Chennai", 
            "admin": "Tamil Nadu ", 
            "country": "India", 
            "population_proper": "4328063", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "13.084622", 
            "lng": "80.248357", 
            "population": "7163000"
        }, 
        {
            "city": "Bengal\u016bru", 
            "admin": "Karnataka", 
            "country": "India", 
            "population_proper": "5104047", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "12.977063", 
            "lng": "77.587106", 
            "population": "6787000"
        }, 
        {
            "city": "Hyderabad", 
            "admin": "Andhra Pradesh", 
            "country": "India", 
            "population_proper": "3597816", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "17.384052", 
            "lng": "78.456355", 
            "population": "6376000"
        }, 
        {
            "city": "Ahmadabad", 
            "admin": "Gujarat", 
            "country": "India", 
            "population_proper": "3719710", 
            "iso2": "IN", 
            "capital": "minor", 
            "lat": "23.025793", 
            "lng": "72.587265", 
            "population": "5375000"
        }, 
        {
            "city": "Haora", 
            "admin": "West Bengal", 
            "country": "India", 
            "population_proper": "1027672", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "22.576882", 
            "lng": "88.318566", 
            "population": "4841638"
        }, 
        {
            "city": "Pune", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "2935744", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "18.513271", 
            "lng": "73.849852", 
            "population": "4672000"
        }, 
        {
            "city": "S\u016brat", 
            "admin": "Gujarat", 
            "country": "India", 
            "population_proper": "2894504", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "21.195944", 
            "lng": "72.830232", 
            "population": "3842000"
        }, 
        {
            "city": "Mardanpur", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "2823249", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "26.430066", 
            "lng": "80.267176", 
            "population": "3162000"
        }, 
        {
            "city": "Rampura", 
            "admin": "Rajasthan", 
            "country": "India", 
            "population_proper": "2711758", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "26.884682", 
            "lng": "75.789336", 
            "population": "2917000"
        }, 
        {
            "city": "Lucknow", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "2472011", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "26.839281", 
            "lng": "80.923133", 
            "population": "2695000"
        }, 
        {
            "city": "Nara", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "2228018", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "21.203096", 
            "lng": "79.089284", 
            "population": "2454000"
        }, 
        {
            "city": "Patna", 
            "admin": "Bihar", 
            "country": "India", 
            "population_proper": "1599920", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "25.615379", 
            "lng": "85.101027", 
            "population": "2158000"
        }, 
        {
            "city": "Indore", 
            "admin": "Madhya Pradesh", 
            "country": "India", 
            "population_proper": "1837041", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "22.717736", 
            "lng": "75.85859", 
            "population": "2026000"
        }, 
        {
            "city": "Vadodara", 
            "admin": "Gujarat", 
            "country": "India", 
            "population_proper": "1409476", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "22.299405", 
            "lng": "73.208119", 
            "population": "1756000"
        }, 
        {
            "city": "Bhopal", 
            "admin": "Madhya Pradesh", 
            "country": "India", 
            "population_proper": "1599914", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "23.254688", 
            "lng": "77.402892", 
            "population": "1727000"
        }, 
        {
            "city": "Coimbatore", 
            "admin": "Tamil Nadu ", 
            "country": "India", 
            "population_proper": "959823", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "11.005547", 
            "lng": "76.966122", 
            "population": "1696000"
        }, 
        {
            "city": "Ludhiana", 
            "admin": "Punjab", 
            "country": "India", 
            "population_proper": "1545368", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "30.912042", 
            "lng": "75.853789", 
            "population": "1649000"
        }, 
        {
            "city": "\u0100gra", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "1430055", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "27.187935", 
            "lng": "78.003944", 
            "population": "1592000"
        }, 
        {
            "city": "Kalyan", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "1576614", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "19.243703", 
            "lng": "73.135537", 
            "population": "1576614"
        }, 
        {
            "city": "Vishakhapatnam", 
            "admin": "Andhra Pradesh", 
            "country": "India", 
            "population_proper": "1063178", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "17.704052", 
            "lng": "83.297663", 
            "population": "1529000"
        }, 
        {
            "city": "Kochi", 
            "admin": "Kerala", 
            "country": "India", 
            "population_proper": "604696", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "9.947743", 
            "lng": "76.253802", 
            "population": "1519000"
        }, 
        {
            "city": "Nasik", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "1289497", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "19.999963", 
            "lng": "73.776887", 
            "population": "1473000"
        }, 
        {
            "city": "Meerut", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "1223184", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "28.980018", 
            "lng": "77.706356", 
            "population": "1398000"
        }, 
        {
            "city": "Far\u012bdabad", 
            "admin": "Haryana", 
            "country": "India", 
            "population_proper": "1394000", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "28.411236", 
            "lng": "77.313162", 
            "population": "1394000"
        }, 
        {
            "city": "Varanasi", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "1164404", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "25.31774", 
            "lng": "83.005811", 
            "population": "1352000"
        }, 
        {
            "city": "Ghaziabad", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "1199191", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "28.665353", 
            "lng": "77.439148", 
            "population": "1341000"
        }, 
        {
            "city": "\u0100sansol", 
            "admin": "West Bengal", 
            "country": "India", 
            "population_proper": "1328000", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "23.683333", 
            "lng": "86.983333", 
            "population": "1328000"
        }, 
        {
            "city": "Jamshedpur", 
            "admin": "Jharkhand", 
            "country": "India", 
            "population_proper": "616338", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "22.802776", 
            "lng": "86.185448", 
            "population": "1300000"
        }, 
        {
            "city": "Madurai", 
            "admin": "Tamil Nadu ", 
            "country": "India", 
            "population_proper": "909908", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "9.917347", 
            "lng": "78.119622", 
            "population": "1294000"
        }, 
        {
            "city": "Jabalpur", 
            "admin": "Madhya Pradesh", 
            "country": "India", 
            "population_proper": "1030168", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "23.174495", 
            "lng": "79.935903", 
            "population": "1285000"
        }, 
        {
            "city": "Rajkot", 
            "admin": "Gujarat", 
            "country": "India", 
            "population_proper": "1099882", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "22.291606", 
            "lng": "70.793217", 
            "population": "1260000"
        }, 
        {
            "city": "Dhanbad", 
            "admin": "Jharkhand", 
            "country": "India", 
            "population_proper": "219636", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "23.801988", 
            "lng": "86.443244", 
            "population": "1246000"
        }, 
        {
            "city": "Amritsar", 
            "admin": "Punjab", 
            "country": "India", 
            "population_proper": "1092450", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "31.622337", 
            "lng": "74.875335", 
            "population": "1212000"
        }, 
        {
            "city": "Warangal", 
            "admin": "Andhra Pradesh", 
            "country": "India", 
            "population_proper": "865527", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "17.978423", 
            "lng": "79.600209", 
            "population": "1203853"
        }, 
        {
            "city": "Allahabad", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "1073438", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "25.44478", 
            "lng": "81.843217", 
            "population": "1201000"
        }, 
        {
            "city": "Sr\u012bnagar", 
            "admin": "Jammu and Kashm\u012br", 
            "country": "India", 
            "population_proper": "975857", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "34.085652", 
            "lng": "74.805553", 
            "population": "1140000"
        }, 
        {
            "city": "Aurangabad", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "1016441", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "19.880943", 
            "lng": "75.346739", 
            "population": "1113000"
        }, 
        {
            "city": "Bhilai", 
            "admin": "Chhatt\u012bsgarh", 
            "country": "India", 
            "population_proper": "1097000", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "21.209188", 
            "lng": "81.428497", 
            "population": "1097000"
        }, 
        {
            "city": "Solapur", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "961112", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "17.671523", 
            "lng": "75.910437", 
            "population": "1057000"
        }, 
        {
            "city": "Ranchi", 
            "admin": "Jharkhand", 
            "country": "India", 
            "population_proper": "846454", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "23.347768", 
            "lng": "85.338564", 
            "population": "1044000"
        }, 
        {
            "city": "Jodhpur", 
            "admin": "Rajasthan", 
            "country": "India", 
            "population_proper": "921476", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "26.26841", 
            "lng": "73.005943", 
            "population": "995000"
        }, 
        {
            "city": "Guwahati", 
            "admin": "Assam", 
            "country": "India", 
            "population_proper": "17516", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "26.176076", 
            "lng": "91.762932", 
            "population": "983000"
        }, 
        {
            "city": "Chandigarh", 
            "admin": "Chand\u012bgarh", 
            "country": "India", 
            "population_proper": "914371", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "30.736292", 
            "lng": "76.788398", 
            "population": "979000"
        }, 
        {
            "city": "Gwalior", 
            "admin": "Madhya Pradesh", 
            "country": "India", 
            "population_proper": "882458", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "26.229825", 
            "lng": "78.173369", 
            "population": "978000"
        }, 
        {
            "city": "Thiruvananthapuram", 
            "admin": "Kerala", 
            "country": "India", 
            "population_proper": "784153", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "8.485498", 
            "lng": "76.949238", 
            "population": "954000"
        }, 
        {
            "city": "Tiruchchirappalli", 
            "admin": "Tamil Nadu ", 
            "country": "India", 
            "population_proper": "775484", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "10.815499", 
            "lng": "78.696513", 
            "population": "951000"
        }, 
        {
            "city": "Hubli", 
            "admin": "Karnataka", 
            "country": "India", 
            "population_proper": "792804", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "15.349955", 
            "lng": "75.138619", 
            "population": "890000"
        }, 
        {
            "city": "Mysore", 
            "admin": "Karnataka", 
            "country": "India", 
            "population_proper": "868313", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "12.292664", 
            "lng": "76.638543", 
            "population": "887000"
        }, 
        {
            "city": "Raipur", 
            "admin": "Chhatt\u012bsgarh", 
            "country": "India", 
            "population_proper": "679995", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "21.233333", 
            "lng": "81.633333", 
            "population": "875000"
        }, 
        {
            "city": "Salem", 
            "admin": "Tamil Nadu ", 
            "country": "India", 
            "population_proper": "778396", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "11.651165", 
            "lng": "78.158672", 
            "population": "873000"
        }, 
        {
            "city": "Bhubaneshwar", 
            "admin": "Odisha", 
            "country": "India", 
            "population_proper": "762243", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "20.272411", 
            "lng": "85.833853", 
            "population": "844000"
        }, 
        {
            "city": "Kota", 
            "admin": "Rajasthan", 
            "country": "India", 
            "population_proper": "763088", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "25.182544", 
            "lng": "75.839065", 
            "population": "827000"
        }, 
        {
            "city": "Jhansi", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "412927", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "25.458872", 
            "lng": "78.579943", 
            "population": "826494"
        }, 
        {
            "city": "Bareilly", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "745435", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "28.347023", 
            "lng": "79.421934", 
            "population": "817000"
        }, 
        {
            "city": "Al\u012bgarh", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "753207", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "27.881453", 
            "lng": "78.07464", 
            "population": "805000"
        }, 
        {
            "city": "Bhiwandi", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "707035", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "19.300229", 
            "lng": "73.058813", 
            "population": "795000"
        }, 
        {
            "city": "Jammu", 
            "admin": "Jammu and Kashm\u012br", 
            "country": "India", 
            "population_proper": "465567", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "32.735686", 
            "lng": "74.869112", 
            "population": "791000"
        }, 
        {
            "city": "Moradabad", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "721139", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "28.838931", 
            "lng": "78.776838", 
            "population": "787000"
        }, 
        {
            "city": "Mangalore", 
            "admin": "Karnataka", 
            "country": "India", 
            "population_proper": "417387", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "12.865371", 
            "lng": "74.842432", 
            "population": "776632"
        }, 
        {
            "city": "Kolhapur", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "561841", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "16.695633", 
            "lng": "74.231669", 
            "population": "750000"
        }, 
        {
            "city": "Amravati", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "603837", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "20.933272", 
            "lng": "77.75152", 
            "population": "734451"
        }, 
        {
            "city": "Dehra D\u016bn", 
            "admin": "Uttarakhand", 
            "country": "India", 
            "population_proper": "578420", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "30.324427", 
            "lng": "78.033922", 
            "population": "714223"
        }, 
        {
            "city": "Malegaon Camp", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "435362", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "20.569974", 
            "lng": "74.515415", 
            "population": "690844"
        }, 
        {
            "city": "Nellore", 
            "admin": "Andhra Pradesh", 
            "country": "India", 
            "population_proper": "404158", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "14.449918", 
            "lng": "79.986967", 
            "population": "678004"
        }, 
        {
            "city": "Gopalpur", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "674246", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "26.735389", 
            "lng": "83.38064", 
            "population": "674246"
        }, 
        {
            "city": "Shimoga", 
            "admin": "Karnataka", 
            "country": "India", 
            "population_proper": "319550", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "13.932424", 
            "lng": "75.572555", 
            "population": "654055"
        }, 
        {
            "city": "Tirupp\u016br", 
            "admin": "Tamil Nadu ", 
            "country": "India", 
            "population_proper": "444543", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "11.104096", 
            "lng": "77.346402", 
            "population": "650000"
        }, 
        {
            "city": "Raurkela", 
            "admin": "Odisha", 
            "country": "India", 
            "population_proper": "483629", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "22.224964", 
            "lng": "84.864143", 
            "population": "625831"
        }, 
        {
            "city": "Nanded", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "550564", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "19.160227", 
            "lng": "77.314971", 
            "population": "623708"
        }, 
        {
            "city": "Belgaum", 
            "admin": "Karnataka", 
            "country": "India", 
            "population_proper": "610189", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "15.862643", 
            "lng": "74.508534", 
            "population": "608756"
        }, 
        {
            "city": "Sangli", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "601214", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "16.856777", 
            "lng": "74.569196", 
            "population": "601214"
        }, 
        {
            "city": "Chanda", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "328351", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "19.950758", 
            "lng": "79.295229", 
            "population": "595118"
        }, 
        {
            "city": "Ajmer", 
            "admin": "Rajasthan", 
            "country": "India", 
            "population_proper": "517911", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "26.452103", 
            "lng": "74.638667", 
            "population": "589985"
        }, 
        {
            "city": "Cuttack", 
            "admin": "Odisha", 
            "country": "India", 
            "population_proper": "580000", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "20.522922", 
            "lng": "85.78813", 
            "population": "580000"
        }, 
        {
            "city": "B\u012bkaner", 
            "admin": "Rajasthan", 
            "country": "India", 
            "population_proper": "395908", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "28.017623", 
            "lng": "73.314955", 
            "population": "576015"
        }, 
        {
            "city": "Bhavnagar", 
            "admin": "Gujarat", 
            "country": "India", 
            "population_proper": "464602", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "21.774455", 
            "lng": "72.152496", 
            "population": "554978"
        }, 
        {
            "city": "Hisar", 
            "admin": "Haryana", 
            "country": "India", 
            "population_proper": "301249", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "29.153938", 
            "lng": "75.722944", 
            "population": "544829"
        }, 
        {
            "city": "Bilaspur", 
            "admin": "Chhatt\u012bsgarh", 
            "country": "India", 
            "population_proper": "330106", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "22.080046", 
            "lng": "82.155431", 
            "population": "543454"
        }, 
        {
            "city": "Tirunelveli", 
            "admin": "Tamil Nadu ", 
            "country": "India", 
            "population_proper": "435844", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "8.725181", 
            "lng": "77.684519", 
            "population": "542200"
        }, 
        {
            "city": "Gunt\u016br", 
            "admin": "Andhra Pradesh", 
            "country": "India", 
            "population_proper": "530577", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "16.299737", 
            "lng": "80.457293", 
            "population": "530577"
        }, 
        {
            "city": "Shiliguri", 
            "admin": "West Bengal", 
            "country": "India", 
            "population_proper": "515574", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "26.710035", 
            "lng": "88.428512", 
            "population": "515574"
        }, 
        {
            "city": "Ujjain", 
            "admin": "Madhya Pradesh", 
            "country": "India", 
            "population_proper": "457346", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "23.182387", 
            "lng": "75.776433", 
            "population": "513350"
        }, 
        {
            "city": "Davangere", 
            "admin": "Karnataka", 
            "country": "India", 
            "population_proper": "435125", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "14.469237", 
            "lng": "75.92375", 
            "population": "503564"
        }, 
        {
            "city": "Akola", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "428857", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "20.709569", 
            "lng": "76.998103", 
            "population": "503502"
        }, 
        {
            "city": "Saharanpur", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "484873", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "29.967896", 
            "lng": "77.545221", 
            "population": "484873"
        }, 
        {
            "city": "Gulbarga", 
            "admin": "Karnataka", 
            "country": "India", 
            "population_proper": "481478", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "17.335827", 
            "lng": "76.83757", 
            "population": "483615"
        }, 
        {
            "city": "Bhatpara", 
            "admin": "West Bengal", 
            "country": "India", 
            "population_proper": "483129", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "22.866431", 
            "lng": "88.401129", 
            "population": "483129"
        }, 
        {
            "city": "Dh\u016blia", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "366980", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "20.901299", 
            "lng": "74.777373", 
            "population": "479073"
        }, 
        {
            "city": "Udaipur", 
            "admin": "Rajasthan", 
            "country": "India", 
            "population_proper": "422784", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "24.57951", 
            "lng": "73.690508", 
            "population": "469737"
        }, 
        {
            "city": "Bellary", 
            "admin": "Karnataka", 
            "country": "India", 
            "population_proper": "336681", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "15.142049", 
            "lng": "76.92398", 
            "population": "445388"
        }, 
        {
            "city": "Tuticorin", 
            "admin": "Tamil Nadu ", 
            "country": "India", 
            "population_proper": "436094", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "8.805038", 
            "lng": "78.151884", 
            "population": "436094"
        }, 
        {
            "city": "Kurnool", 
            "admin": "Andhra Pradesh", 
            "country": "India", 
            "population_proper": "278124", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "15.828865", 
            "lng": "78.036021", 
            "population": "424920"
        }, 
        {
            "city": "Gaya", 
            "admin": "Bihar", 
            "country": "India", 
            "population_proper": "423692", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "24.796858", 
            "lng": "85.003852", 
            "population": "423692"
        }, 
        {
            "city": "S\u012bkar", 
            "admin": "Rajasthan", 
            "country": "India", 
            "population_proper": "237579", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "27.614778", 
            "lng": "75.138671", 
            "population": "400000"
        }, 
        {
            "city": "Tumk\u016br", 
            "admin": "Karnataka", 
            "country": "India", 
            "population_proper": "307359", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "13.341358", 
            "lng": "77.102203", 
            "population": "399606"
        }, 
        {
            "city": "Kollam", 
            "admin": "Kerala", 
            "country": "India", 
            "population_proper": "394163", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "8.881131", 
            "lng": "76.584694", 
            "population": "394163"
        }, 
        {
            "city": "Ahmadnagar", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "367140", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "19.094571", 
            "lng": "74.738432", 
            "population": "391760"
        }, 
        {
            "city": "Bh\u012blwara", 
            "admin": "Rajasthan", 
            "country": "India", 
            "population_proper": "326431", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "25.347071", 
            "lng": "74.640812", 
            "population": "389911"
        }, 
        {
            "city": "Nizamabad", 
            "admin": "Andhra Pradesh", 
            "country": "India", 
            "population_proper": "305438", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "18.673151", 
            "lng": "78.10008", 
            "population": "388505"
        }, 
        {
            "city": "Parbhani", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "289629", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "19.268553", 
            "lng": "76.770807", 
            "population": "378326"
        }, 
        {
            "city": "Shillong", 
            "admin": "Meghalaya", 
            "country": "India", 
            "population_proper": "354325", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "25.573987", 
            "lng": "91.896807", 
            "population": "375527"
        }, 
        {
            "city": "Lat\u016br", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "348967", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "18.399487", 
            "lng": "76.584252", 
            "population": "374394"
        }, 
        {
            "city": "Rajapalaiyam", 
            "admin": "Tamil Nadu ", 
            "country": "India", 
            "population_proper": "307959", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "9.451111", 
            "lng": "77.556121", 
            "population": "369991"
        }, 
        {
            "city": "Bhagalpur", 
            "admin": "Bihar", 
            "country": "India", 
            "population_proper": "361548", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "25.244462", 
            "lng": "86.971832", 
            "population": "361548"
        }, 
        {
            "city": "Muzaffarnagar", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "349706", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "29.470914", 
            "lng": "77.703324", 
            "population": "349706"
        }, 
        {
            "city": "Muzaffarpur", 
            "admin": "Bihar", 
            "country": "India", 
            "population_proper": "333200", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "26.122593", 
            "lng": "85.390553", 
            "population": "333200"
        }, 
        {
            "city": "Mathura", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "330511", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "27.503501", 
            "lng": "77.672145", 
            "population": "330511"
        }, 
        {
            "city": "Patiala", 
            "admin": "Punjab", 
            "country": "India", 
            "population_proper": "329224", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "30.336245", 
            "lng": "76.392199", 
            "population": "329224"
        }, 
        {
            "city": "Saugor", 
            "admin": "Madhya Pradesh", 
            "country": "India", 
            "population_proper": "247333", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "23.838766", 
            "lng": "78.738738", 
            "population": "328240"
        }, 
        {
            "city": "Brahmapur", 
            "admin": "Odisha", 
            "country": "India", 
            "population_proper": "324726", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "19.311514", 
            "lng": "84.792903", 
            "population": "324726"
        }, 
        {
            "city": "Shahbazpur", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "320434", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "27.874116", 
            "lng": "79.879327", 
            "population": "320434"
        }, 
        {
            "city": "New Delhi", 
            "admin": "Delhi", 
            "country": "India", 
            "population_proper": "317797", 
            "iso2": "IN", 
            "capital": "primary", 
            "lat": "28.6", 
            "lng": "77.2", 
            "population": "317797"
        }, 
        {
            "city": "Rohtak", 
            "admin": "Haryana", 
            "country": "India", 
            "population_proper": "317245", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "28.894473", 
            "lng": "76.589166", 
            "population": "317245"
        }, 
        {
            "city": "Samlaipadar", 
            "admin": "Odisha", 
            "country": "India", 
            "population_proper": "162887", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "21.478072", 
            "lng": "83.990505", 
            "population": "310852"
        }, 
        {
            "city": "Ratlam", 
            "admin": "Madhya Pradesh", 
            "country": "India", 
            "population_proper": "236843", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "23.330331", 
            "lng": "75.040315", 
            "population": "307229"
        }, 
        {
            "city": "F\u012brozabad", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "306409", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "27.150917", 
            "lng": "78.397808", 
            "population": "306409"
        }, 
        {
            "city": "Rajahmundry", 
            "admin": "Andhra Pradesh", 
            "country": "India", 
            "population_proper": "304804", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "17.005171", 
            "lng": "81.777839", 
            "population": "304804"
        }, 
        {
            "city": "Barddhaman", 
            "admin": "West Bengal", 
            "country": "India", 
            "population_proper": "301725", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "23.255716", 
            "lng": "87.856906", 
            "population": "301725"
        }, 
        {
            "city": "B\u012bdar", 
            "admin": "Karnataka", 
            "country": "India", 
            "population_proper": "204071", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "17.913309", 
            "lng": "77.530105", 
            "population": "300136"
        }, 
        {
            "city": "Bamanpur\u012b", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "296418", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "28.804495", 
            "lng": "79.040305", 
            "population": "296418"
        }, 
        {
            "city": "Kakinada", 
            "admin": "Andhra Pradesh", 
            "country": "India", 
            "population_proper": "292923", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "16.960361", 
            "lng": "82.238086", 
            "population": "292923"
        }, 
        {
            "city": "Pan\u012bpat", 
            "admin": "Haryana", 
            "country": "India", 
            "population_proper": "292808", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "29.387471", 
            "lng": "76.968246", 
            "population": "292808"
        }, 
        {
            "city": "Khammam", 
            "admin": "Andhra Pradesh", 
            "country": "India", 
            "population_proper": "170503", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "17.247672", 
            "lng": "80.143682", 
            "population": "290839"
        }, 
        {
            "city": "Bhuj", 
            "admin": "Gujarat", 
            "country": "India", 
            "population_proper": "289429", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "23.253972", 
            "lng": "69.669281", 
            "population": "289429"
        }, 
        {
            "city": "Kar\u012bmnagar", 
            "admin": "Andhra Pradesh", 
            "country": "India", 
            "population_proper": "228745", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "18.436738", 
            "lng": "79.13222", 
            "population": "288251"
        }, 
        {
            "city": "Tirupati", 
            "admin": "Andhra Pradesh", 
            "country": "India", 
            "population_proper": "250821", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "13.635505", 
            "lng": "79.419888", 
            "population": "287035"
        }, 
        {
            "city": "Hospet", 
            "admin": "Karnataka", 
            "country": "India", 
            "population_proper": "197846", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "15.269537", 
            "lng": "76.387103", 
            "population": "286007"
        }, 
        {
            "city": "Chikka Mandya", 
            "admin": "Karnataka", 
            "country": "India", 
            "population_proper": "134845", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "12.545602", 
            "lng": "76.895078", 
            "population": "285034"
        }, 
        {
            "city": "Alwar", 
            "admin": "Rajasthan", 
            "country": "India", 
            "population_proper": "283228", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "27.566291", 
            "lng": "76.610202", 
            "population": "283228"
        }, 
        {
            "city": "Aizawl", 
            "admin": "Mizoram", 
            "country": "India", 
            "population_proper": "265331", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "23.736701", 
            "lng": "92.714596", 
            "population": "283021"
        }, 
        {
            "city": "Bijapur", 
            "admin": "Karnataka", 
            "country": "India", 
            "population_proper": "270870", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "16.827715", 
            "lng": "75.718988", 
            "population": "271064"
        }, 
        {
            "city": "Imphal", 
            "admin": "Manipur", 
            "country": "India", 
            "population_proper": "223523", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "24.808053", 
            "lng": "93.944203", 
            "population": "264986"
        }, 
        {
            "city": "Tharati Etawah", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "257448", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "26.758236", 
            "lng": "79.014875", 
            "population": "257448"
        }, 
        {
            "city": "Raich\u016br", 
            "admin": "Karnataka", 
            "country": "India", 
            "population_proper": "225962", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "16.205459", 
            "lng": "77.35567", 
            "population": "255240"
        }, 
        {
            "city": "Pathankot", 
            "admin": "Punjab", 
            "country": "India", 
            "population_proper": "174306", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "32.274842", 
            "lng": "75.652865", 
            "population": "253987"
        }, 
        {
            "city": "Ch\u012brala", 
            "admin": "Andhra Pradesh", 
            "country": "India", 
            "population_proper": "87001", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "15.823849", 
            "lng": "80.352187", 
            "population": "253000"
        }, 
        {
            "city": "Son\u012bpat", 
            "admin": "Haryana", 
            "country": "India", 
            "population_proper": "250521", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "28.994778", 
            "lng": "77.019375", 
            "population": "250521"
        }, 
        {
            "city": "Mirzapur", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "233691", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "25.144902", 
            "lng": "82.565335", 
            "population": "245817"
        }, 
        {
            "city": "Hapur", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "242920", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "28.729845", 
            "lng": "77.780681", 
            "population": "242920"
        }, 
        {
            "city": "Porbandar", 
            "admin": "Gujarat", 
            "country": "India", 
            "population_proper": "138872", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "21.641346", 
            "lng": "69.600868", 
            "population": "234684"
        }, 
        {
            "city": "Bharatpur", 
            "admin": "Rajasthan", 
            "country": "India", 
            "population_proper": "229384", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "27.215251", 
            "lng": "77.492786", 
            "population": "229384"
        }, 
        {
            "city": "Puducherry", 
            "admin": "Puducherry", 
            "country": "India", 
            "population_proper": "227411", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "11.933812", 
            "lng": "79.829792", 
            "population": "227411"
        }, 
        {
            "city": "Karnal", 
            "admin": "Haryana", 
            "country": "India", 
            "population_proper": "225049", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "29.691971", 
            "lng": "76.984483", 
            "population": "225049"
        }, 
        {
            "city": "Nagercoil", 
            "admin": "Tamil Nadu ", 
            "country": "India", 
            "population_proper": "213858", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "8.177313", 
            "lng": "77.43437", 
            "population": "224329"
        }, 
        {
            "city": "Thanjav\u016br", 
            "admin": "Tamil Nadu ", 
            "country": "India", 
            "population_proper": "219571", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "10.785233", 
            "lng": "79.139093", 
            "population": "219571"
        }, 
        {
            "city": "Pali", 
            "admin": "Rajasthan", 
            "country": "India", 
            "population_proper": "207394", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "25.775125", 
            "lng": "73.320611", 
            "population": "210103"
        }, 
        {
            "city": "Agartala", 
            "admin": "Tripura", 
            "country": "India", 
            "population_proper": "203264", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "23.836049", 
            "lng": "91.279386", 
            "population": "203264"
        }, 
        {
            "city": "Ongole", 
            "admin": "Andhra Pradesh", 
            "country": "India", 
            "population_proper": "172872", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "15.503565", 
            "lng": "80.044541", 
            "population": "202860"
        }, 
        {
            "city": "Puri", 
            "admin": "Odisha", 
            "country": "India", 
            "population_proper": "201026", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "19.798254", 
            "lng": "85.824938", 
            "population": "201026"
        }, 
        {
            "city": "Dindigul", 
            "admin": "Tamil Nadu ", 
            "country": "India", 
            "population_proper": "200797", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "10.362853", 
            "lng": "77.975827", 
            "population": "200797"
        }, 
        {
            "city": "Haldia", 
            "admin": "West Bengal", 
            "country": "India", 
            "population_proper": "200762", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "22.025278", 
            "lng": "88.058333", 
            "population": "200762"
        }, 
        {
            "city": "Bulandshahr", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "198612", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "28.403922", 
            "lng": "77.857731", 
            "population": "198612"
        }, 
        {
            "city": "Purnea", 
            "admin": "Bihar", 
            "country": "India", 
            "population_proper": "198453", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "25.776703", 
            "lng": "87.473655", 
            "population": "198453"
        }, 
        {
            "city": "Proddat\u016br", 
            "admin": "Andhra Pradesh", 
            "country": "India", 
            "population_proper": "177797", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "14.7502", 
            "lng": "78.548129", 
            "population": "197451"
        }, 
        {
            "city": "Gurgaon", 
            "admin": "Haryana", 
            "country": "India", 
            "population_proper": "197340", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "28.460105", 
            "lng": "77.026352", 
            "population": "197340"
        }, 
        {
            "city": "Khanapur", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "197233", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "21.273716", 
            "lng": "76.117376", 
            "population": "197233"
        }, 
        {
            "city": "Machil\u012bpatnam", 
            "admin": "Andhra Pradesh", 
            "country": "India", 
            "population_proper": "192827", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "16.187466", 
            "lng": "81.13888", 
            "population": "192827"
        }, 
        {
            "city": "Bhiwani", 
            "admin": "Haryana", 
            "country": "India", 
            "population_proper": "190855", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "28.793044", 
            "lng": "76.13968", 
            "population": "190855"
        }, 
        {
            "city": "Nandyal", 
            "admin": "Andhra Pradesh", 
            "country": "India", 
            "population_proper": "165337", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "15.477994", 
            "lng": "78.483605", 
            "population": "188654"
        }, 
        {
            "city": "Bhusaval", 
            "admin": "Maharashtra", 
            "country": "India", 
            "population_proper": "172366", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "21.043649", 
            "lng": "75.785058", 
            "population": "183001"
        }, 
        {
            "city": "Bharauri", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "182218", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "27.598203", 
            "lng": "81.694709", 
            "population": "182218"
        }, 
        {
            "city": "Tonk", 
            "admin": "Rajasthan", 
            "country": "India", 
            "population_proper": "151331", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "26.168672", 
            "lng": "75.786111", 
            "population": "181734"
        }, 
        {
            "city": "Sirsa", 
            "admin": "Haryana", 
            "country": "India", 
            "population_proper": "160129", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "29.534893", 
            "lng": "75.028981", 
            "population": "181639"
        }, 
        {
            "city": "Vizianagaram", 
            "admin": "Andhra Pradesh", 
            "country": "India", 
            "population_proper": "1194", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "18.11329", 
            "lng": "83.397743", 
            "population": "179358"
        }, 
        {
            "city": "Vellore", 
            "admin": "Tamil Nadu ", 
            "country": "India", 
            "population_proper": "177081", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "12.905769", 
            "lng": "79.137104", 
            "population": "177081"
        }, 
        {
            "city": "Alappuzha", 
            "admin": "Kerala", 
            "country": "India", 
            "population_proper": "176783", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "9.494647", 
            "lng": "76.331108", 
            "population": "176783"
        }, 
        {
            "city": "Shimla", 
            "admin": "Himachal Pradesh", 
            "country": "India", 
            "population_proper": "173503", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "31.104423", 
            "lng": "77.166623", 
            "population": "173503"
        }, 
        {
            "city": "Hindupur", 
            "admin": "Andhra Pradesh", 
            "country": "India", 
            "population_proper": "133298", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "13.828065", 
            "lng": "77.491425", 
            "population": "168312"
        }, 
        {
            "city": "Baram\u016bla", 
            "admin": "Jammu and Kashm\u012br", 
            "country": "India", 
            "population_proper": "77276", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "34.209004", 
            "lng": "74.342853", 
            "population": "167986"
        }, 
        {
            "city": "Bakshpur", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "166480", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "25.894283", 
            "lng": "80.792104", 
            "population": "166480"
        }, 
        {
            "city": "Dibrugarh", 
            "admin": "Assam", 
            "country": "India", 
            "population_proper": "122155", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "27.479888", 
            "lng": "94.90837", 
            "population": "166366"
        }, 
        {
            "city": "Saidapur", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "164435", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "27.598784", 
            "lng": "80.75089", 
            "population": "164435"
        }, 
        {
            "city": "Navsari", 
            "admin": "Gujarat", 
            "country": "India", 
            "population_proper": "163000", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "20.85", 
            "lng": "72.916667", 
            "population": "163000"
        }, 
        {
            "city": "Budaun", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "161555", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "28.038114", 
            "lng": "79.126677", 
            "population": "161555"
        }, 
        {
            "city": "Cuddalore", 
            "admin": "Tamil Nadu ", 
            "country": "India", 
            "population_proper": "158569", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "11.746289", 
            "lng": "79.764362", 
            "population": "158569"
        }, 
        {
            "city": "Har\u012bpur", 
            "admin": "Punjab", 
            "country": "India", 
            "population_proper": "158142", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "31.463218", 
            "lng": "75.986418", 
            "population": "158142"
        }, 
        {
            "city": "Krishnapuram", 
            "admin": "Tamil Nadu ", 
            "country": "India", 
            "population_proper": "155029", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "12.869617", 
            "lng": "79.719469", 
            "population": "155029"
        }, 
        {
            "city": "Fyzabad", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "153047", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "26.775486", 
            "lng": "82.150182", 
            "population": "153047"
        }, 
        {
            "city": "Silchar", 
            "admin": "Assam", 
            "country": "India", 
            "population_proper": "152393", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "24.827327", 
            "lng": "92.797868", 
            "population": "152393"
        }, 
        {
            "city": "Ambala", 
            "admin": "Haryana", 
            "country": "India", 
            "population_proper": "146787", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "30.360993", 
            "lng": "76.797819", 
            "population": "146787"
        }, 
        {
            "city": "Krishnanagar", 
            "admin": "West Bengal", 
            "country": "India", 
            "population_proper": "145926", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "23.405761", 
            "lng": "88.490733", 
            "population": "145926"
        }, 
        {
            "city": "Kolar", 
            "admin": "Karnataka", 
            "country": "India", 
            "population_proper": "126441", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "13.137679", 
            "lng": "78.129989", 
            "population": "144625"
        }, 
        {
            "city": "Kumbakonam", 
            "admin": "Tamil Nadu ", 
            "country": "India", 
            "population_proper": "139264", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "10.959789", 
            "lng": "79.377472", 
            "population": "139264"
        }, 
        {
            "city": "Tiruvannamalai", 
            "admin": "Tamil Nadu ", 
            "country": "India", 
            "population_proper": "138243", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "12.230204", 
            "lng": "79.072954", 
            "population": "138243"
        }, 
        {
            "city": "P\u012blibh\u012bt", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "131008", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "28.631245", 
            "lng": "79.804362", 
            "population": "131008"
        }, 
        {
            "city": "Abohar", 
            "admin": "Punjab", 
            "country": "India", 
            "population_proper": "130603", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "30.144533", 
            "lng": "74.19552", 
            "population": "130603"
        }, 
        {
            "city": "Port Blair", 
            "admin": "Andaman and Nicobar Islands", 
            "country": "India", 
            "population_proper": "112050", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "11.666667", 
            "lng": "92.75", 
            "population": "127562"
        }, 
        {
            "city": "Al\u012bpur Duar", 
            "admin": "West Bengal", 
            "country": "India", 
            "population_proper": "127342", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "26.4835", 
            "lng": "89.522855", 
            "population": "127342"
        }, 
        {
            "city": "Hat\u012bsa", 
            "admin": "Uttar Pradesh", 
            "country": "India", 
            "population_proper": "126882", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "27.592698", 
            "lng": "78.013843", 
            "population": "126882"
        }, 
        {
            "city": "Valparai", 
            "admin": "Tamil Nadu ", 
            "country": "India", 
            "population_proper": "90353", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "10.325163", 
            "lng": "76.955299", 
            "population": "114308"
        }, 
        {
            "city": "Aurangabad", 
            "admin": "Bihar", 
            "country": "India", 
            "population_proper": "95929", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "24.752037", 
            "lng": "84.374202", 
            "population": "95929"
        }, 
        {
            "city": "Kohima", 
            "admin": "Nagaland", 
            "country": "India", 
            "population_proper": "92113", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "25.674673", 
            "lng": "94.110988", 
            "population": "92113"
        }, 
        {
            "city": "Gangtok", 
            "admin": "Sikkim", 
            "country": "India", 
            "population_proper": "30700", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "27.325739", 
            "lng": "88.612155", 
            "population": "77900"
        }, 
        {
            "city": "Kar\u016br", 
            "admin": "Tamil Nadu ", 
            "country": "India", 
            "population_proper": "76915", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "10.960277", 
            "lng": "78.076753", 
            "population": "76915"
        }, 
        {
            "city": "Jorhat", 
            "admin": "Assam", 
            "country": "India", 
            "population_proper": "69033", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "26.757509", 
            "lng": "94.203055", 
            "population": "69033"
        }, 
        {
            "city": "Panaji", 
            "admin": "Goa", 
            "country": "India", 
            "population_proper": "65586", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "15.498289", 
            "lng": "73.824541", 
            "population": "65586"
        }, 
        {
            "city": "Saidpur", 
            "admin": "Jammu and Kashm\u012br", 
            "country": "India", 
            "population_proper": "58416", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "34.318174", 
            "lng": "74.457093", 
            "population": "63035"
        }, 
        {
            "city": "Tezpur", 
            "admin": "Assam", 
            "country": "India", 
            "population_proper": "58851", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "26.633333", 
            "lng": "92.8", 
            "population": "58851"
        }, 
        {
            "city": "Itanagar", 
            "admin": "Arunachal Pradesh", 
            "country": "India", 
            "population_proper": "44971", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "27.102349", 
            "lng": "93.692047", 
            "population": "44971"
        }, 
        {
            "city": "Daman", 
            "admin": "Daman and Diu", 
            "country": "India", 
            "population_proper": "39737", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "20.414315", 
            "lng": "72.83236", 
            "population": "39737"
        }, 
        {
            "city": "Silvassa", 
            "admin": "Dadra and Nagar Haveli", 
            "country": "India", 
            "population_proper": "27359", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "20.273855", 
            "lng": "72.996728", 
            "population": "27359"
        }, 
        {
            "city": "Diu", 
            "admin": "Daman and Diu", 
            "country": "India", 
            "population_proper": "23779", 
            "iso2": "IN", 
            "capital": "", 
            "lat": "20.715115", 
            "lng": "70.987952", 
            "population": "23779"
        }, 
        {
            "city": "Dispur", 
            "admin": "Assam", 
            "country": "India", 
            "population_proper": "16140", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "26.135638", 
            "lng": "91.800688", 
            "population": "16140"
        }, 
        {
            "city": "Kavaratti", 
            "admin": "Lakshadweep", 
            "country": "India", 
            "population_proper": "10688", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "10.566667", 
            "lng": "72.616667", 
            "population": "10688"
        }, 
        {
            "city": "Calicut", 
            "admin": "Kerala", 
            "country": "India", 
            "population_proper": "", 
            "iso2": "IN", 
            "capital": "minor", 
            "lat": "11.248016", 
            "lng": "75.780402", 
            "population": ""
        }, 
        {
            "city": "Kagaznagar", 
            "admin": "Andhra Pradesh", 
            "country": "India", 
            "population_proper": "", 
            "iso2": "IN", 
            "capital": "minor", 
            "lat": "19.331589", 
            "lng": "79.466051", 
            "population": ""
        }, 
        {
            "city": "Jaipur", 
            "admin": "Rajasthan", 
            "country": "India", 
            "population_proper": "", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "26.913312", 
            "lng": "75.787872", 
            "population": ""
        }, 
        {
            "city": "Ghandinagar", 
            "admin": "Gujarat", 
            "country": "India", 
            "population_proper": "", 
            "iso2": "IN", 
            "capital": "admin", 
            "lat": "23.216667", 
            "lng": "72.683333", 
            "population": ""
        }, 
        {
            "city": "Panchkula", 
            "admin": "Haryana", 
            "country": "India", 
            "population_proper": "", 
            "iso2": "IN", 
            "capital": "minor", 
            "lat": "30.691512", 
            "lng": "76.853736", 
            "population": ""
        }
    ])

  })

module.exports=router