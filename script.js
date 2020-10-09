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
app.use(bodyParser.json());
app.use(cors());
// starting route
app.get('/',(req,res) => {
    res.send('database.users');
});
//  '/signin' route 
app.post('/signin',(req,res) =>{
    db.select('email','hash').from('login')
    .where('email', '=', req.body.email)
    .then(data =>{
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid){
            return db.select('*').from('users')
            .where('email','=',req.body.email)
            .then(user =>{
                res.json(user[0])
            })
            .catch(err => res.status('400').json('unable to get user'));
        }
        else{
            res.status('400').json('wrong credentials');
        }
    })
    .catch(err =>res.status('400').json('wrong credentials'));
});

// register new users uisng '/register' route

app.post('/register',(req,res) =>{
    const { email, name , password} = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx =>{
        trx.insert({
            hash: hash,
            email : email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
          return trx('users')
            .returning('*')
            .insert({
             email:loginEmail[0],
             name:name,
             joined: new Date()
            })
            .then(user =>{
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
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