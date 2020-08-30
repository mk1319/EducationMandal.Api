const mysql=require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root2',
    password: '1234',
    database: 'educationmandal',
    multipleStatements:true,
    debug:false
  })
  
connection.connect((err)=>{
    if(!err){
        console.log("Connected")
    }
    else{
        console.log(err)
    }
})

module.exports=connection
  