const express=require('express')
const connection=require('../../mysqlconnection')
const jwtencode=require('jwt-simple')
const router=express.Router()
const uuid=require("uniqid")
const fs=require('fs')


router.post('/Login',(req,res)=>{
        let email=req.body.Email
        let Password=req.body.Password

        connection.query(`select * from Teacher where Email=?`,[email],(err,rows,fields)=>{
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
            connection.query('Update Teacher set LastLogin=? where TeacherID=?',[date,rows[0].TeacherID])
                    
                return res.send({Email:rows[0].Email,ID:rows[0].TeacherID,User:rows[0].Name,isLogin:true,msg:"Login Sucessful"})
            }
            else{
                res.status(400)
                res.send({msg:"Error in Fatching Data!",isLogin:false})
            }
        })
})

//Google Login

router.post('/GoogleLogin',(req,res)=>{
    let email=req.body.Email

    connection.query(`select * from Teacher where Email=?`,[email],(err,rows,fields)=>{
        if(!err)
        {
            if(rows.length==0){
                   return res.send({isLogin:false,msg:"Email is not register!!"})
            }
            
            d=new Date()
            date=d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()
        connection.query('Update Teacher set LastLogin=? where TeacherID=?',[date,rows[0].TeacherID])
                
            return res.send({Email:rows[0].Email,ID:rows[0].TeacherID,User:rows[0].Name,isLogin:true,msg:"Login Sucessful"})
        }
        else{
            res.status(400)
            res.send({msg:"Error in Fatching Data!",isLogin:false})
        }
    })
})

//Fatch Update profile Data
router.get('/getdata/:id',(req,res)=>{

    connection.query('select Teacher.Name,Teacher.Picture,Teacherdetail.Experience,Teacherdetail.Qualification,Teacherdetail.Biography from Teacher left join Teacherdetail on Teacher.TeacherID=teacherdetail.TeacherID where Teacher.TeacherID=?',
    [req.params.id],(err,rows,fields)=>{
        if(!err)
        {
                res.send(rows[0])
        }
        else
        {
            res.send({msg:"Error In Fatching Data."})
        }
    })
})

//Update profile's

router.post("/Updateprofile",(req,res)=>{

    connection.query("update Teacher set Name=? where TeacherID=?;Select * from Teacherdetail where TeacherID=?",[req.body.Name,req.body.ID,req.body.ID],(err,rows,fields)=>{
        if(!err)
        {
            if(rows[1].length)
            {
                connection.query("update Teacherdetail set Experience=?,Qualification=? ,Biography=? where TeacherID=?",[req.body.Experience,req.body.Qualification,req.body.Biography,req.body.ID])
            }
            else
            {
                connection.query("insert into Teacherdetail(Experience,Qualification,Biography,TeacherID) value(?,?,?,?)",[req.body.Experience,req.body.Qualification,req.body.Biography,req.body.ID])
            }
            res.send({msg:"Data Updated"})
        }   
        else
        {
            res.send({msg:"Error in during update!"})
        }
    })

})


//upload Profile

router.post('/UploadImage/:id', (req, res) => {

if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  } 

const file = req.files.file;
const ID=req.params.id

connection.query('select Picture from Teacher where TeacherID=? ',[ID],(err,rows,fields)=>{
       
      file.name=`${uuid()}${ID}.${file.name.split('.').pop()}`
     
       file.mv(`${__dirname.split('\\').slice(0,-2).join('\\')}/assest/Class/Image/${file.name}`, err =>{

         if (err) {
           return res.send({msg:"File not uploded"});
         }

         if(rows.length===0)
         {
            connection.query('Update Teacher set Picture=? where TeacherID=?;',[file.name,ID])
            return res.json({ fileName: file.name, filePath:`${file.name}`,msg:"Image uploaded."});
         }
        
         fs.unlink(`${__dirname.split('\\').slice(0,-2).join('\\')}/assest/Class/Image/${rows[0].Picture}`, function (err) {});

         connection.query('Update Teacher set Picture=? where TeacherID=? ',[file.name,ID])

         res.json({ fileName: file.name, filePath: `/uploads/${file.name}`,msg:"Image Updated."});

       });

     })
});






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




module.exports=router