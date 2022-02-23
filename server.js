const express = require("express");
const server = express();
const mysql = require('mysql');

server.use(express.urlencoded({extended:true}));
server.use(express.json());

//server port
const PORT = 3000;
server.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});

//Create connection 
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'studentdb',
    timezone : "+00:00"
});
//connect
db.connect((error)=>{
    if(error){
        //console.log(error)
        throw error;
    }
    else{
        console.log("mysql Connected")
    }
    
});

//view students
server.get("/view",(req,res)=>{
    db.query("SELECT * FROM student",function(error,rows,fields){
        if(error){
            console.log(error);
        }
        else{
            console.log("Successful quiery\n");
            console.log(rows);
            res.send(rows);
            
        }
    })
});

//Student registration
server.post("/register",(req,res)=>{

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const age =  req.body.age;
    const registerDate =  req.body.registeredDate;

    //Insert data to Student Table
    db.query("INSERT INTO  Student (First_Name, Last_Name,Age,Registered_Date)VALUES(?,?,?,?)",
    [firstName,lastName,age,registerDate]),function(error,rows,fields){
        if(error){
            //console.log(error);
            throw error;
        }
        else{
            console.log("Successful quiery\n");
        }
    };

    //response
    db.query("select * from student where student_id IN (select max(student_id) from student)",function(error,rows,fields){
        
        if(error){
            //console.log(error);
            throw error;
        }
        else{
            console.log("Successful quiery\n");
           // console.log(rows);
            res.send(rows);
        }
    })

})


server.use((req,res)=>{
    res.type("text/plain")
    res.send("404 page not found");
})


