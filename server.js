const express = require('express');
//import bodyParser and require it - pretty much every express apps comes with it
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex')

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

//connecting server to database
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'papirus',
      database : 'faceapp'
    }
  });

db.select('*').from('users').then(data => {
    console.log(data);
});

const app = express();

app.use(cors());
app.use(bodyParser.json()); //app.use because its a middleware --> after the app variable has been created

app.get('/', (req, res) => { res.send('it is working') })

app.post('/signin', signin.handleSignin(db, bcrypt))

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db)})
 
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
})

/* 1. root route --> res = this is working
    2. signin route --> POST = success/fail
    3. register route --> POST = user
    4. profile/:userId --> GET = user
    5. image --> PUT(update on the user profile)--> return the
    updated user OBj
*/