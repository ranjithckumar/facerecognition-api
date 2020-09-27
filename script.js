const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// Database for users
const database = { 
    users :[
        {
            id:'123',
            name:'ranjith',
            email:'ranjith@gmail.com',
            password:'ranjith',
            entries:0,
            joined: new Date()
        },
        {
            id:'124',
            name:'kumar',
            email:'kumar@gmail.com',
            password:'kumar',
            entries:0,
            joined: new Date()
        }     
    ]
}

// starting route
app.get('/',(req,res) => {
    res.send(database.users);
});
//  '/signin' route 
app.post('/signin',(req,res) =>{
    if(req.body.email === database.users[0].email 
        && req.body.password === database.users[0].password){
            res.json('Success');
        }
        else{
            res.status(400).json('error logginng in');
        }
    
});

// register new users uisng '/register' route

app.post('/register',(req,res) =>{
    const { email, name , password} = req.body;
    database.users.push({
            id:'125',
            name:name,
            email:email,
            password:password,
            entries:0,
            joined: new Date()
    })
    res.send(database.users[database.users.length-1]);
});

// server running on port 3000
app.listen(3000,(req,res)=>{
    console.log('server running on port:3000')
});