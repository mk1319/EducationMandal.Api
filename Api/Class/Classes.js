const express=require('express')
const connection=require('../../mysqlconnection')

const router=express.Router()








//FullData
router.get("/FullData/:id",(req,res)=>{

        let sql="SELECT * FROM CLASS where ClassID=?;"+"SELECT * FROM CLASSBRIEF WHERE ClassID =?;"+
            "select * from classimage where ClassID=?;"+"select * from classlocation where ClassID=?;";

            const data=[]

            let id=req.params.id
            connection.query(sql,[id,id,id,id],(err,rows,fields)=>{
                        if(!err){
                            rows[0].map((row)=>{
                                data.push(row={...row,classbrief:rows[1][0],classimage:rows[2][0],classlocation:rows[3][0]})
                                

                            })
                            res.send(data)
                        }
                        else{
                            res.status(400)
                            res.json({msg:"Error in Fatching Data!"})
                        }
            })
})

//ClassBrance
router.get("/Brance/:id",(req,res)=>{
    
    connection.query(`select * from brance where ClassId=${req.params.id}`,(err,rows,fields)=>{
        
        if(!err){

            res.send(rows)
        }
        else{
            res.status(400)
            res.json({msg:"Error in Fatching Data!"})
        }
    
    })
})
//ClassBlog
router.get("/ClassBlog/:id",(req,res)=>{
    connection.query(`select * from blog where ClassId=${req.params.id}`,(err,rows,fields)=>{
        if(!err){   
            res.send(rows)
        }
        else{
            res.status(400)
            res.json({msg:"Error in Fatching Data!"})
        }
    })
})

//all student by classid
router.get("/AllStudent/:id",(req,res)=>{

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Accept");


    let sql="select student.StudentID,student.Name,student.Picture,"
    +"studentdetail.SchoolName,studentdetail.InstaLink,studentdetail.FacebookLink,studentdetail.TwitterLink "
    +`from student,studentdetail where ClassID=${req.params.id}`

    connection.query(sql,(err,rows,fields)=>{
                if(!err){
                    res.send(rows)
                }
                else{
                    res.status(400)
                    res.send({msg:"Error in Fatching Data"})
                }
    })
})

//AllTeacherBy ClassId
router.get("/AllTeacher/:id",(req,res)=>{

    let sql="select teacher.TeacherID,teacher.Name,"+
    "teacherdetail.InstaLink,teacherdetail.FacebookLink,teacherdetail.TwitterLink"
     +` from teacher,teacherdetail where ClassID=${req.params.id}`
        
    connection.query(sql,(err,rows,fields)=>{
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

router.get("/ALlReview/:id",(req,res)=>{

    connection.query(`select * from classreview where ClassID=${req.params.id}`,(err,rows,fields)=>{
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