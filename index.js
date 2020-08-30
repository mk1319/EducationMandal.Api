const express=require('express')
const body=require('body-parser')
const Classrouter=require('./Api/Class/Classes')
const ClassFilter=require('./Api/Class/ClassFilter')
const Userrouter=require('./Api/User/UserData')
const Blog=require('./Api/Blog/Blog')
const Admin=require('./Api/Admin/Class')
const cors=require('cors')


const ClassDashboard=require('./Api/ClassDash/ClassData')



const PORT=process.env.PORT || 5000


const app=express()


app.use(cors())
//BodyParser
app.use(body.json())



app.use(express.urlencoded({extended:true}))

app.use('/Class',Classrouter);

app.use('/ClassDash',ClassDashboard)


app.use('/ClassFilter',ClassFilter);
app.use('/User',Userrouter)
app.use('/Blog',Blog)

app.use('/Admin',Admin)


app.get('/',(req,res)=>{

res.send('<h1>Hello World</h1>')
})

app.listen(PORT,()=>{
    console.log('Server running')
})


module.exports=express