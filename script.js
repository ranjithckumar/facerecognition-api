const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');             //package for postgresql coonection
//sytax to connect psql db
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'postgres',
      database : 'smartbrain'
    }
  });
// queries for db

db.select('*').from('users');
const app = express();


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

app.use(bodyParser.json());
app.use(cors());
// starting route
app.get('/',(req,res) => {
    res.send(database.users);
});
//  '/signin' route 
app.post('/signin',(req,res) =>{
;
    if(req.body.email === database.users[0].email 
        && req.body.password === database.users[0].password){
            res.json('success');
        }
        else{
            res.status(400).json('error logginng in');
        }
    
});

// register new users uisng '/register' route

app.post('/register',(req,res) =>{
    const { email, name , password} = req.body;
   db('users')
   .returning('*')
   .insert({
    email:email,
    name:name,
    joined: new Date()
   })
   .then(user =>{
       res.json(user[0]);
   })
   .catch(err =>{
       res.status('400').json('unable to register');
   })
    
});

// get user infomation based on userid '/profile:id'

app.get('/profile/:id', (req,res) =>{
    const { id } =  req.params;
    db.select('*').from('users').where({id})
    .then(user =>{
        if(user.length){
            res.json(user[0]);
        }
        else{
            res.status(400).json('Invalid user id or user does not exist');
        }
       
    })
    .catch(err =>{
        res.status(400).json('Invalid user id or user does not exist');
    });
});

// To update rank of users '/image'

app.put('/image', (req,res) =>{
    const {  id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries =>{
        // console.log(entries);
        res.json(entries[0]);
    })
    .catch(err =>{
        res.status('400').json('unable to get entries');
    })
});


// server running on port 3000
app.listen(5000,(req,res)=>{
    console.log('server running on port:5000')
});