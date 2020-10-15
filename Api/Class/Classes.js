const express=require('express')
const connection=require('../../mysqlconnection')
const router=express.Router()
const uuid=require('uniqid')
const sendmail=require('../../Mail')




//Create Class
router.post('/CreateClass',(req,res)=>{
 
    let Name,Contact,City,State,Type,ID,Email

    Name=req.body.Name
    Email=req.body.Email
    Contact=req.body.Contact
    State=req.body.State
    City=req.body.City
    Type=req.body.Type 
    ID=uuid('',Email.slice(0,-9)).slice(5)

    

    connection.query(`select * from Class where Email=?`,[Email],(err,rows,fields)=>{
        if(!err)
        {
            if(rows.length)
            {
                res.send({msg:"Email alerady register!"})
            }
            else
            {
            connection.query('insert into class(Name,SysID,Email,Contact,City,State,Type,Status) value(?,?,?,?,?,?,?,0)'
                ,[Name,ID,Email,Contact,City,State,Type],(err,rows,fields)=>{
                    if(!err)
                    {
                        let Password=uuid().slice(5)

                        let sql="insert into Classlogin(ClassID,Name,Email,Contact,Password,UserType) Values(?,?,?,?,?,?)"
                        connection.query(sql,[rows.insertId,Name,Email,Contact,Password,"Owner"],(err,rows,fields)=>{

                            if(!err)
                            {
                                res.send({msg:"Class Created,You will receive credential."})
                                
                                const mailOptions = {
                                    from: 'noreply@educationmandal.com', 
                                    to: Email, 
                                    subject: 'EducationMandal Login Detail ', 
                                    html: `<h3>Password:- ${Password}</h3>`
                                  };

                                sendmail.sendMail(mailOptions, function (err, info) {
                                     if(!err)
                                      {
                                      
                                      }
                                     else
                                     {
                                       
                                     }
                                    });
                            }
                            else{
                                res.send(err)
                            }
                        })
                    }
                    else{
                        res.send({msg:"Error in Inserting Data!",err:err})
                    }
                })
            }
        }
        else{
            res.status(400)
            res.send({msg:"Error in Fatching Data!",isLogin:false})
        }
    })
})




//FullData
router.get("/FullData/:id",(req,res)=>{

        let sql="select Class.ClassID,Class.Name,Class.City,Class.Town,Class.State,Class.Type,Class.Pincode,Classbrief.Vission,Classbrief.AboutClass,Classbrief.Mission,Classbrief.Vission,Classbrief.Tagline,Classbrief.YearOfCorp,Classimage.Logo,Classimage.Image,"
        +" Classlocation.Lon,Classlocation.Lat,Classlocation.Address as googleaddress from class left join Classbrief on "+
        " Class.ClassID=Classbrief.ClassID left join Classimage on Classimage.ClassID=Class.ClassID left join Classlocation on Classlocation.ClassID=Class.ClassID where Class.ClassID=?";


            let id=req.params.id
            let Data=[]
            connection.query(sql,[id],(err,rows,fields)=>{
                if(!err)
                {
                     Data=rows[0]
                    
                    connection.query(`select Name,City,Town,LinkOfClass,BranceID from Brance where ClassID=?`,id,(err,rows,fields)=>{
                        if(!err)
                        {
                            Data={...Data,Brance:rows}

                            res.status(200).send(Data)
                                     
                        }
                        else{
                            res.send(Data)
                        }
                        })
                }
                else
                {
                        res.status(400)
                        res.json({msg:"Error in Fatching Data!"})
                }
            })
})


//Teacher By Id final
router.get("/TeacherProfile/:id",(req,res)=>{
    let sql="select Teacher.Name,Teacher.TeacherID,Teacherdetail.Rate,Teacher.Picture,Teacherdetail.Qualification,Teacherdetail.Experience,Teacherdetail.Biogrphy from Teacher left join Teacherdetail on Teacher.TeacherID =Teacherdetail.TeacherID WHERE Teacher.TeacherID=?";
     
    connection.query(sql,req.params.id,(err,rows,fields)=>{
        if(!err){
            let Data=rows[0]

            connection.query('select Name,TeacherID,Message,Rate,Date,ID  from Teacherreview where  Vissible=1 and TeacherID=?',req.params.id,(err,rows,fields)=>{
                if(!err)
                {
                    Data={...Data,Review:rows}
                 
                    res.send(Data)
                }
                else{
                    res.send(Data)
                }
            })
        }
        else{
            res.status(400)
            res.send({msg:"Error in Fatching Data"})
        }
    })
})


//AllTeacherBy ClassId Final
router.get("/AllTeacher/:id",(req,res)=>{
    let sql="select Teacher.Name,Teacher.TeacherId as ID,Teacherdetail.Rate,Teacher.Picture from Teacher left join Teacherdetail on Teacher.TeacherID =Teacherdetail.TeacherID WHERE ClassID=?";
     
    connection.query(sql,req.params.id,(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }
        else{
            res.status(400)
            res.send({msg:err})
        }
    })

})



//newCourse
router.get("/Courses/:id",(req,res)=>{  
    connection.query(`select * from newcourse where ClassID=${req.params.id}`,(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }
        else{
            res.status(400)
            res.send({msg:"Error in Fatching Data"})
        }
    })
})


//SbjectStreme

router.get("/Catagory/:id",(req,res)=>{
   
    let sql="select StreamID as id,Name as stream,TotalFess,ClassID from stream where ClassID=?"
   
    connection.query(sql,[req.params.id],(err,rows,fields)=>{
        if(!err)
        {
            let id=[]

            rows.filter((data)=>{id.push(data.id)})
            
            const data=rows

            connection.query("select SubjectID as courseId,Name as subject,TeacherName as professor,Fess as price,StreamID as streamid from subject where StreamID in (?)"
            ,[id.length?id:""],(err,rows,fileds)=>{

                if(!err)
                {   
                    let Datas=data.map((d)=>{
                              let course=rows.filter((row)=>row.streamid===d.id)
                    
                            return {...d,course:course}
                        })

                    res.send(Datas)
                }
                else{

                }
            })
        }
        else{
            res.status(400)
            res.send({msg:err})
        }
    })
})


//All Review
router.get("/AllReview/:id",(req,res)=>{
    connection.query(`select * from classreview where ClassID=? and Visible=1 order by Rate Desc`,req.params.id,(err,rows,fields)=>{
            if(!err){
                res.send(rows)
            }
            else{
                res.status(400)
                res.send({msg:"Error in Fatching Data"})
            }
    })
})



module.exports=router