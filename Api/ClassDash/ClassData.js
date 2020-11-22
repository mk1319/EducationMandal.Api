const express=require('express')
const connection=require('../../mysqlconnection')
const uuid=require('uniqid')
const fs=require('fs')
const path=require('path')
const sendmail=require('../../Mail');

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

    let sql="Select StreamID,Name,TotalFess from Stream where ClassID=?";

    connection.query(sql,[req.params.id],(err,rows,fields)=>{
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



    connection.query("delete from subject where StreamID=?",[req.body.ID],(err,rows,fields)=>{
        if(!err)
        {
            connection.query("Delete from Stream where StreamID=? and ClassID=?",[req.body.ID,req.params.ClassID],(err,rows,fields)=>{
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
    Password=uuid().slice(5)

connection.query(`select * from Teacher where Email='${Email}'`,(err,rows,fields)=>{

    if(!err){
        if(rows.length==0)
        { 
            let sql="insert into Teacher(Name,Email,UniqueID,ClassId,Password) Values(?,?,?,?,?)"
            connection.query(sql,[Name,Email,UniqueID,ClassID,Password],(error,rows,fields)=>{
               if(!error)
               {
                    res.send({msg:"Data Inserted."}) 

                    //Call function for email

                    res.send({msg:"Login Credential is Send to You!!"})
                    const mailOptions = {
                       from: 'noreply@educationmandal.com', 
                       to: Email, 
                       subject: 'EducationMandal Login Detail ', 
                       html: `<h3>Password:- ${Password}</h3>`
                     };

                   sendmail.sendMail(mailOptions, function (err, info) {});

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



//Delete Teacher Record  DONE
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

//Update Profile class dash function
router.get("/profile/:id",(req,res)=>{

    let sql="select Class.Name,Classbrief.AboutClass,Classbrief.Tagline,Classimage.Image,Classlocation.Lon,Classlocation.Lat,Classlocation.Address " 
    +"from Class left join Classbrief on Class.ClassID=Classbrief.ClassID left join Classimage on Class.ClassID=Classimage.ClassID " 
    +"left join Classlocation on Class.ClassID=Classlocation.ClassID where Class.ClassID=?"
    connection.query(sql,[req.params.id],(err,rows,fields)=>{
        if(!err)
        {
            res.send(rows[0])
        }   
        else
        {
            res.send(err)
        }
    })


})

//update name,

router.post("/updateprofile",(req,res)=>{

    connection.query("update Class set Name=? where ClassID=?;Select * from Classbrief where ClassID=?",[req.body.Name,req.body.ClassID,req.body.ClassID],(err,rows,fields)=>{
        if(!err)
        {
            if(rows[1].length)
            {
                connection.query("update Classbrief set Tagline=?,AboutClass=? where ClassID=?",[req.body.Tagline,req.body.AboutClass,req.body.ClassID])
            }
            else
            {
                connection.query("insert into Classbrief(Tagline,AboutClass,ClassID) value(?,?,?)",[req.body.Tagline,req.body.AboutClass,req.body.ClassID])
            }
            res.send({msg:"Data Updated"})
        }   
        else
        {
            res.send({msg:"Error in during update!"})
        }
    })


})


//Update Student data
router.put('/UpdateStudent',(req,res)=>{



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
    let email=req.body.Email
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

            return res.send({Email:rows[0].Email,ID:rows[0].ClassID,User:rows[0].UserType,Name:rows[0].Name,AccessID:rows[0].AccessID,isLogin:true,msg:"Login Sucessful"})
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
    

connection.query(`select * from Classlogin where Email='${Email}'`,(err,rows,fields)=>{
    if(!err){
        if(rows.length==0)
        { 
            let sql="insert into Classlogin(ClassID,Name,Email,Contact,Password,UserType) Values(?,?,?,?,?,?)"
            connection.query(sql,[ClassID,Name,Email,Contact,Password,UserType],(error,rows,fields)=>{
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
        res.send({msg:"Error in Inserting Data!"})
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

    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
      } 

    const file = req.files.file;
    const ClassID=req.params.id

    connection.query('select Image  from  Classimage where ClassID=? ',[ClassID],(err,rows,fields)=>{
    
     
       
      file.name=`${uuid()}${ClassID}.${file.name.split('.').pop()}`
     
       file.mv(`${__dirname.split('\\').slice(0,-2).join('\\')}/assest/Class/Image/${file.name}`, err =>{

         if (err) {
           return res.send({msg:"File not uploded"});
         }

        
         if(rows.length===0)
         {
            connection.query('insert into Classimage(Image,ClassID) value(?,?)',[file.name,ClassID])
            return res.json({ fileName: file.name, filePath:`${file.name}`,msg:"Image uploaded."});
         }
        
         fs.unlink(`${__dirname.split('\\').slice(0,-2).join('\\')}/assest/Class/Image/${rows[0].Image}`, function (err) {});

         connection.query('update Classimage set Image=? where ClassID=?',[file.name,ClassID])

         res.json({ fileName: file.name, filePath: `/uploads/${file.name}`,msg:"Image Updated."});

       });

     })
  });





  router.get('/city',(req,res)=>{

    res.send({'City': ['Agartala', 'Agra', 'Ahmedabad', 'Aizwal', 'Ajmer', 'Allahabad', 'Alleppey', 'Alibaug', 'Almora', 'Alsisar', 'Alwar', 'Ambala', 'Amla', 'Amritsar', 'Anand', 'Ankleshwar', 'Ashtamudi', 'Auli', 'Aurangabad', 'Baddi', 'Badrinath', 'Balasinor', 'Balrampur', 'Bambora', 'Bandhavgarh', 'Bandipur', 'Bangalore', 'Barbil', 'Bareilly', 'Behror', 'Belgaum', 'Berhampur', 'Betalghat', 'Bharatpur', 'Bhandardara', 'Bharuch', 'Bhavangadh', 'Bhavnagar', 'Bhilai', 'Bhimtal', 'Bhopal', 'Bhubaneshwar', 'Bhuj', 'Bikaner', 'Binsar', 'Bodhgaya', 'Bundi', 'Calicut', 'Canannore', 'Chail', 'Chamba', 'Chandigarh', 'Chennai', 'Chikmagalur', 'Chiplun', 'Chitrakoot', 'Chittorgarh', 'Coimbatore', 'Coonoor', 'Coorg', 'Corbett national park', 'Cuttack', 'Dabhosa', 'Dalhousie', 'Daman', 'Dandeli', 'Dapoli', 'Darjeeling', 'Dausa', 'Dehradun', 'Dharamshala', 'Dibrugarh', 'Digha', 'Diu', 'Dive agar', 'Dooars', 'Durgapur', 'Durshet', 'Dwarka', 'Faridabad', 'Firozabad', 'Gangotri', 'Gangtok', 'Ganapatipule', 'Gandhidham', 'Gandhinagar', 'Garhmukteshwar', 'Garhwal', 'Gaya', 'Ghaziabad', 'Goa', 'Gokharna', 'Gondal', 'Gorakhpur', 'Greater noida', 'Gulmarg', 'Gurgaon', 'Guruvayoor', 'Guwahati', 'Gwalior', 'Halebid', 'Hampi', 'Hansi', 'Haridwar', 'Hassan', 'Hospet', 'Hosur', 'Hubli', 'Hyderabad', 'Idukki', 'Igatpuri', 'Imphal', 'Indore', 'Jabalpur', 'Jaipur', 'Jaisalmer', 'Jalandhar', 'Jalgaon', 'Jambugodha', 'Jammu', 'Jamnagar', 'Jamshedpur', 'Jawhar', 'Jhansi', 'Jodhpur', 'Jojawar', 'Jorhat', 'Junagadh', 'Kabini', 'Kalimpong', 'Kanatal', 'Kanchipuram', 'Kanha', 'Kanpur', 'Kanyakumari', 'Kargil', 'Karjat', 'Karnal', 'Karur', 'Karwar', 'Kasargod', 'Kasauli', 'Kashipur', 'Kashid', 'Katra', 'Kausani', 'Kaza', 'Kaziranga', 'Kedarnath', 'Khajjiar', 'Khajuraho', 'Khandala', 'Khimsar', 'Kochin', 'Kodaikanal', 'Kolhapur', 'Kolkata', 'Kollam', 'Kota', 'Kotagiri', 'Kottayam', 'Kovalam', 'Kufri', 'Kumbalgarh', 'Kullu', 'Kumarakom', 'Kumbakonam', 'Kumily', 'Kurseong', 'Kushinagar', 'Lachung', 'Leh', 'Lakshadweep', 'Lonavala', 'Lothal', 'Lucknow', 'Ludhiana', 'Lumbini', 'Madurai', 'Mahabaleshwar', 'Mahabalipuram', 'Malappuram', 'Malpe', 'Malshej ghat', 'Malvan', 'Manali', 'Mandavi', 'Mandawa', 'Manesar', 'Mararri', 'Mandormoni', 'Mangalore', 'Manmad', 'Marchula', 'Matheran', 'Mathura', 'Mcleodganj', 'Mohali', 'Mount abu', 'Moradabad', 'Morbi', 'Mukteshwar', 'Mumbai', 'Mundra', 'Munnar', 'Murud janjira', 'Mussoorie', 'Mysore', 'Nadukani', 'Nagapattinam', 'Nagarhole', 'Nagaur fort', 'Nagothane', 'Nagpur', 'Nahan', 'Nainital', 'Naldhera', 'Nanded', 'Napne', 'Nasik', 'Navi mumbai', 'Neral', 'New delhi', 'Nilgiri', 'Noida', 'Ooty', 'Orchha', 'Osian', 'Pachmarhi', 'Palampur', 'Palanpur', 'Pali', 'Pahalgam', 'Palitana', 'Pallakad', 'Panchgani', 'Panchkula', 'Panna', 'Panhala', 'Panvel', 'Pantnagar', 'Parwanoo', 'Patiala', 'Pathankot', 'Patna', 'Patnitop', 'Pelling', 'Pench', 'Phagwara', 'Phalodi', 'Pinjore', 'Pondicherry', 'Poovar', 'Porbandar', 'Port blair', 'Poshina', 'Pragpur', 'Pune', 'Puri', 'Puskhar', 'Puttaparthi', 'Rai bareilly', 'Raichak', 'Raipur', 'Rajasthan', 'Rajgir', 'Rajkot', 'Rajpipla', 'Rajsamand', 'Rajahmundry', 'Rameshwaram', 'Ram nagar', 'Ramgarh', 'Ranakpur', 'Ranchi', 'Ranikhet', 'Ranny', 'Ranthambore', 'Ratnagiri', 'Ravangla', 'Rishikesh', 'Rishyap', 'Rohetgarh', 'Rourkela', 'Sajan', 'Salem', 'Saputara', 'Sasan gir', 'Sattal', 'Sawai madhopur', 'Sawantwadi', 'Secunderabad', 'Shillong', 'Shimla', 'Shimlipal', 'Shirdi', 'Sharavanbelgola', 'Shivanasamudra', 'Siana', 'Siliguri', 'Silvassa', 'Sivaganga district', 'Solan', 'Sonauli', 'Srinagar', 'Sunderban', 'Surat', 'Tanjore', 'Tapola', 'Tarapith', 'Thane', 'Thekkady', 'Thirvannamalai', 'Thiruvananthapuram', 'Tiruchirapalli', 'Tirupur', 'Tirupati', 'Thrissur', 'Udaipur', 'Udhampur', 'Udupi', 'Ujjain', 'Uttarkashi', 'Vadodara', 'Vagamon', 'Varkala', 'Vapi', 'Varanasi', 'Velankanni', 'Vellore', 'Veraval', 'Vijayawada', 'Vikramgadh', 'Vishakapatnam', 'Wayanad', 'Wankaner', 'Yamunotri', 'Yercaud', 'Yuksom'], 'States': ['Andhra pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal pradesh', 'Jammu & kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Ncr', 'Nepal', 'New delhi', 'North sikkim', 'Orissa', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil nadu', 'Tripura', 'Uttar pradesh', 'Uttarakhand', 'Uttaranchal', 'West bengal', 'West sikkim']})
})

module.exports=router