const express=require('express')
const connection=require('../../mysqlconnection')
const router=express.Router()



//FullData
router.get("/FullData/:id",(req,res)=>{

        let sql="select Class.ClassID,Class.Name,Class.Email,Class.Contact,Class.City,Class.Town,Class.State,Class.Type,Class.Pincode,Class.Address,Class.Rate,Classbrief.Vission,Classbrief.Mission,Classbrief.Vission,Classbrief.Tagline,Classbrief.YearOfCorp,Classimage.Logo,Classimage.Image,"
        +" Classlocation.Lon,Classlocation.Lat,Classlocation.Address as googleaddress from class left join Classbrief on "+
        " Class.ClassID=Classbrief.ClassID left join Classimage on Classimage.ClassID=Class.ClassID left join Classlocation on Classlocation.ClassID=Class.ClassID where Class.ClassID=?";

            

            let id=req.params.id
            let Data=[]
            connection.query(sql,[id],(err,rows,fields)=>{
                if(!err)
                {
                     Data=rows[0]
                    
                    connection.query(`select * from Brance where ClassID=?`,id,(err,rows,fields)=>{
                        if(!err)
                        {
                            Data={...Data,Brance:rows}

                            connection.query('Select Name,Rate,TeacherID as ID,Rate,Picture from Teacher where ClassId=?',id,(err,rows,fields)=>{
                                if(!err)
                                {   
                                    Data={...Data,Teacher:rows}

                                    connection.query('select Name,Picture,Rate,StudentType,StudentID as ID,LastName from Student where ClassID=?',id,(err,rows,fields)=>{
                                        if(!err)
                                        {
                                            Data={...Data,Student:rows}
                                            connection.query(`select * from classreview where ClassID=? and Vissible=1 order by Rate Desc`,id,(err,rows,fields)=>{
                                                if(!err){
                                                    res.send({...Data,Review:rows})
                                                }
                                                else{
                                                    res.send(Data)
                                                }
                                            })
                                        }
                                        else{
                                            res.send(Data)
                                        }
                                    })
                                }
                                else{

                                    res.send(Data)
                                }
                            })                        
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

// //ClassBrance
// router.get("/Brance/:id",(req,res)=>{
//     connection.query(`select * from Brance where ClassId=${req.params.id}`,(err,rows,fields)=>{
        
//         if(!err){

//             res.send(rows)
//         }
//         else{
//             res.status(400)
//             res.json({msg:"Error in Fatching Data!"})
//         }
    
//     })
// })

//ClassBlog
router.get("/ClassBlog/:id",(req,res)=>{
    connection.query(`select * from Blog where ClassId=${req.params.id}`,(err,rows,fields)=>{
        if(!err){   
            res.send(rows)
        }
        else{
            res.status(400)
            res.json({msg:"Error in Fatching Data!"})
        }
    })
})


// //all Student by Classid
// router.get("/AllStudent/:id",(req,res)=>{

//     let sql="select Student.StudentID,Student.Name,Student.Picture,Student.Rate,"
//     +"Studentdetail.SchoolName,Studentdetail.InstaLink,Studentdetail.FacebookLink,Studentdetail.TwitterLink "
//     +`from Student,Studentdetail where ClassID=${req.params.id}`

//     connection.query(sql,(err,rows,fields)=>{
//                 if(!err){
//                     res.send(rows)
//                 }
//                 else{
//                     res.status(400)
//                     res.send({msg:"Error in Fatching Data",err})
//                 }
//     })
// })

//Teacher By Id
router.get("/TeacherProfile/:id",(req,res)=>{
    let sql="select Teacher.Name,Teacher.TeacherId,Teacher.Email,Teacher.Contact,Teacher.Rate,Teacher.Picture,Teacherdetail.Qualification,Teacherdetail.Experience,Teacherdetail.Biogrphy from Teacher left join Teacherdetail on Teacher.TeacherID =Teacherdetail.TeacherID WHERE Teacher.TeacherID=?";
     
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


//AllTeacherBy ClassId
router.get("/AllTeacher/:id",(req,res)=>{
    let sql="select Teacher.Name,Teacher.TeacherId,Teacher.Email,Teacher.Contact,Teacher.Rate,Teacher.Picture,Teacherdetail.Qualification,Teacherdetail.Experience,Teacherdetail.Biogrphy from Teacher left join Teacherdetail on Teacher.TeacherID =Teacherdetail.TeacherID WHERE ClassID=?";

     
    connection.query(sql,req.params.id,(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }
        else{
            res.status(400)
            res.send({msg:"Error in Fatching Data"})
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

router.get("/Streme/:id",(req,res)=>{
   
        let sql="select streme.StremeID,streme.Name,streme.TotalFess,"+
        "streme.Disc,streme.AddtionalInfo,subject.SubjectID,subject.SubjectName,subject.Disc,Subject.Fess "+
        `from streme,subject where ClassID=${req.params.id}`
   
    connection.query(sql,(err,rows,fields)=>{
        if(!err)
        {
            res.send(rows)
        }
        else{
            res.status(400)
            res.send({msg:"Error in Fatching Data"})
        }
    })
})


//All Review

router.get("/AllReview/:id",(req,res)=>{
    connection.query(`select * from classreview where ClassID=? and Vissible=1 order by Rate Desc`,req.params.id,(err,rows,fields)=>{
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