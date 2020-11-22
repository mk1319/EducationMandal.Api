const express=require('express')
const connection=require('../../mysqlconnection')
const jwtencode=require('jwt-simple')
const router=express.Router()
const uuid=require("uniqid")
const sendmail=require('../../Mail');


router.post('/NewUser',(req,res)=>{

        let Email,Name,Password,State,City,UserType,d,date,Contact
        Email=req.body.Email
        Password=uuid().slice(5)
        Name=req.body.Name
        State=req.body.State
        City=req.body.City
        UserType=req.body.Type
        Contact=req.body.Contact
        
        d=new Date()
        date=d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()


    connection.query(`select * from Register where Email='${Email}'`,(err,rows,fields)=>{
        if(!err){
            if(rows.length==0)
            { 
                let sql="insert into Register(Name,Email,Password,State,City,UserType,Date,SysID,Contact) Values(?,?,?,?,?,?,?,?,?)"
                connection.query(sql,[Name,Email,Password,State,City,UserType,date,uuid('',Email.slice(0,-9)).slice(5),Contact],(error,rows,fields)=>{
                   if(!error)
                   {
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
                       res.send(error)
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


router.post('/Login',(req,res)=>{
        let email=req.body.Email
        let Password=req.body.Password

        connection.query(`select * from Register where Email=?`,[email],(err,rows,fields)=>{
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
            connection.query('Update Register set LastLogin=? where ID=?',[d,rows[0].ID])

                return res.send({Email:rows[0].Email,
                                ID:rows[0].ID,User:rows[0].UserType,
                                isLogin:true,Name:rows[0].Name
                                ,msg:"Login Sucessful"})
            }
            else{
                res.status(400)
                res.send({msg:"Error in Fatching Data!",isLogin:false})
            }
        })
})




router.post('/Forgatepassword',(req,res)=>{

    Email=req.body.Email
    Password=uuid().slice(5)

    connection.query('select * from Register where Email=?',[Email],(err,rows,fields)=>{

        if(!err)
        {
                if(rows.length!==0)
                {
                    connection.query('update Register set Password=? where Email=?',[Password,Email])   
                    //call function to send mail..
                    res.send({msg:"Email is Sent, With New Password"})
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

//change pass

router.post('/ChangePassword',(req,res)=>{

    ID=req.body.ID
    Password=req.body.Password
    match=req.body.match

    if(match)
    {
    connection.query('select * from Register where ID=? and Password=?',[ID,Password],(err,rows,fields)=>{
        if(!err)
        {
                if(rows.length!==0)
                {

                    res.send({msg:"Enter New Password",status:true})
                }
                else{
                    res.send({msg:"Enter Correct Password",status:false})
                }
        }
        else{
            res.send({msg:"Error in Updatation!!"})
        }
    })  
    }
    else{
        connection.query('update Register set Password=? where ID=?',[Password,ID],(err,rows,fields)=>{
            if(!err)
            {
                res.send({msg:"Password Update Sucessful",status:false})
            }
        })       
    }
})





//admission status

router.get('/AdmissionStatus/:id',(req,res)=>{
    connection.query('SELECT * from Admissionpersonal where ID=?',[req.params.id],(err,rows,fields)=>{
        
        if(!err){
            if(rows.length)
            {
                res.send({status:true,AID:rows[0].Aid})
            }
            else
            {
                res.send({status:false})
            }
        }
        else{
            res.send(err)
        }
    })
})



//Bookmark Class
router.get('/BookmarkClass/:id/:classid',(req,res)=>{
    connection.query(`select ClassID from Bookmark where ID=? and ClassID=?`,[req.params.id,req.params.classid],(err,rows,fields)=>{
        if(!err)
        {
            if(rows.length)
            {
                res.send(true)
            }
            else{
                res.send(false)
            }
        }
        else{
            res.status(400)
            res.send({msg:"Errow in Fatching Data!"})
        }
    })
})

//Remove Bookmark Class
router.get('/BookmarkManager/:id/:classid/:operation',(req,res)=>{
    
    if(req.params.operation==='false')
    {
       
        connection.query(`insert into Bookmark value(?,?)`,[req.params.classid,req.params.id],(err,rows,fields)=>{
            if(!err)
            {
                res.send(true)
            }
            else{
                res.status(400)
                res.send(err)
            }
        })
    }
    else
    {
        connection.query(`delete from Bookmark where ClassID=? and ID=?`,[req.params.classid,req.params.id],(err,rows,fields)=>{
            if(!err)
            {
                res.send(false)
            }
            else{
                res.status(400)
                res.send(err)
            }
        })
    }  
})




//All Bookmark Class
router.get('/AllBookmark/:id',(req,res)=>{
    connection.query(`select Name,ClassID from Class where ClassID IN(select ClassID from Bookmark where ID=?)`,[req.params.id,req.params.classid],(err,rows,fields)=>{
        if(!err)
        {
            if(rows.length)
            {
                res.send(rows)
            }
            else{
                res.send([])
            }
        }
        else{
            res.status(400)
            res.send({msg:"Errow in Fatching Data!"})
        }
    })
})

//Admisson
router.post("/Admission",(req,res)=>{

    const Data=req.body.formData

    connection.query("Select * from Admissionpersonal where ID=?",[Data.ID],(err,rows,fields)=>{
        if(!err)
        {
            if(rows.length)
            {
                connection.query("update Admissionpersonal set Name=?,Surname=?,Gender=?,Date_of_birth=?,Contact=?,Email=?,Address=?,Language=? where Aid=?"
                ,[Data.name,Data.surname,Data.gender,Data.dob,Data.contact,Data.email,Data.currentAddress,Data.language,Data.Aid])

                connection.query("Update AdmissionEducation set Cur_std=?,Cur_Inst=?,Stream=?,Prev_Inst=?,Percentage=?,Hobbies=? where Aid=?",
                [Data.currentStd,Data.currentInstitution,Data.stream,Data.prevInstitution,Data.prevPercentage,Data.hobbies,Data.Aid])

                connection.query('Update Admissionguardian set Father=?,FatherContact=?,FatherEmail=?,FatherQualif=?,Fatheroccu=?,Mother=?,MotherContact=?,MotherEmail=?,MotherQualif=?,Motheroccu=? where Aid=? ;',
                [Data.fatherName,Data.fatherContact,Data.fatherEmail,Data.fatherQualification,Data.fatherOccupation,Data.motherName,Data.motherContact,Data.motherEmail,Data.motherQualification,Data.motherOccupation,Data.Aid])
            
            }
            else
            {
               
               connection.query("insert into Admissionpersonal(Name,Surname,Gender,Date_of_birth,Contact,Email,Address,Language,ID) value(?,?,?,?,?,?,?,?,?)"
                ,[Data.name,Data.surname,Data.gender,Data.dob,Data.contact,Data.email,Data.currentAddress,Data.language,Data.ID],(err,rows,fields)=>{
                
                const id=rows.insertId

                connection.query("insert into AdmissionEducation(Cur_std,Cur_Inst,Stream,Prev_Inst,Percentage,Hobbies,Aid) value(?,?,?,?,?,?,?)",
                [Data.currentStd,Data.currentInstitution,Data.stream,Data.prevInstitution,Data.prevPercentage,Data.hobbies,id])

                connection.query('insert into Admissionguardian(Aid,Father,FatherContact,FatherEmail,FatherQualif,Fatheroccu,Mother,MotherContact,MotherEmail,MotherQualif,Motheroccu) value(?,?,?,?,?,?,?,?,?,?,?)',
                    [id,Data.fatherName,Data.fatherContact,Data.fatherEmail,Data.fatherQualification,Data.fatherOccupation,Data.motherName,Data.motherContact,Data.motherEmail,Data.motherQualification,Data.motherOccupation])
                })
            }
            res.send({msg:"Data Updated"})
        }   
        else
        {
            res.send({msg:"Error in during update!"})
        }
    })
})

//admission detail's
router.get('/Admission/:id',(req,res)=>{
    connection.query(`select Admissionpersonal.Name,Admissionpersonal.Surname,Admissionpersonal.Gender,Admissionpersonal.Aid,Admissionpersonal.Date_of_birth,Admissionpersonal.Contact,Admissionpersonal.Email,Admissionpersonal.Address,Admissionpersonal.Language,AdmissionEducation.Cur_std,AdmissionEducation.Cur_Inst,AdmissionEducation.Stream,AdmissionEducation.Prev_Inst,AdmissionEducation.Percentage,AdmissionEducation.Hobbies,Admissionguardian.Father,Admissionguardian.FatherContact,Admissionguardian.FatherEmail,Admissionguardian.FatherQualif,Admissionguardian.Fatheroccu,Admissionguardian.Mother,Admissionguardian.MotherContact,Admissionguardian.MotherEmail,Admissionguardian.MotherQualif,Admissionguardian.Motheroccu from Admissionpersonal left join AdmissionEducation on Admissionpersonal.Aid=AdmissionEducation.Aid left join Admissionguardian on Admissionguardian.Aid=Admissionpersonal.Aid where Admissionpersonal.ID=?`
    ,[req.params.id],(err,rows,fields)=>{
        if(!err)
        {
            if(rows.length)
            {
                res.send(rows)
            }
            else{
                res.send([])
            }
        }
        else{
            res.status(400)
            res.send({msg:"Errow in Fatching Data!"})
        }
    })
})






module.exports=router