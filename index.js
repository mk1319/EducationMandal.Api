const express=require('express')
const body=require('body-parser')
const Classrouter=require('./Api/Class/Classes')
const ClassFilter=require('./Api/Class/ClassFilter')
const Userrouter=require('./Api/User/UserData')
const Blog=require('./Api/Blog/Blog')

const PORT=process.env.PORT || 3000


const app=express()
//BodyParser
app.use(express.json())



app.use(express.urlencoded({extended:false}))

app.use('/Class',Classrouter);

app.use('/ClassFilter',ClassFilter);
app.use('/User',Userrouter)
app.use('/Blog',Blog)


app.get('/',(req,res)=>{

res.send('<h1>Hello World</h1>')

})

app.listen(PORT,()=>{
    console.log('Server running')
})


module.exports=express