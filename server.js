const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
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
app.get('/',(req,res) => {res.send('database.users')});
//  '/signin' route 
app.post('/signin',(req,res) =>{signin.handleSignIn(req,res,db,bcrypt)});

// register new users uisng '/register' route

app.post('/register',(req,res) => {register.handleRegister(req,res,db,bcrypt)})

// get user infomation based on userid '/profile:id'

app.get('/profile/:id', (req,res) =>{profile.handleProfile(req,res,db)});

// To update rank of users '/image'

app.put('/image', (req,res) =>{image.handleImage(req,res,db)});
// api call
app.post('/imageurl', (req,res) =>{image.handleApiCall(req,res)});


// server running on port 3000
app.listen(process.env.PORT || 3000);