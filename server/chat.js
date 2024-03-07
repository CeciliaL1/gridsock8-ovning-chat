/*var express = require('express');
const router = express.Router();
const cors = require('cors')();*/
const express = require('express');
const app = require('express')();
const server = require('http').createServer(app);
const connection = require('./lib/conn.js');
const logger = require('morgan');
const cors = require('cors');
const { randomUUID } = require('crypto');


connection.connect(function(err){
    if(err) throw err
    else console.log("Uppkopplad till databasen");
  })



const io = require('socket.io')(server, {
    cors: {
        origin:'*',
        methods: ['GET', ' POST']
    }
})

// const usersRouter = require('./routes/users.js');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());


app.get('/', (req, res) => {

    res.send('detta funkar')
})

//app.use('/api/users', usersRouter);




/* GET all users*/ 
app.get('/users', function(req, res) {
 connection.connect((err)=> {
  if(err) console.log(err)

    let query = `SELECT *
                 FROM users`;
  connection.query(query , (err, result) => {
    if(err) console.log(err)
    let newResult = Object.keys(result).length // Checks the lenght of the result

    
    if(newResult == 0) {
      res.status(404).json({message: 'No users exist'})
    } else {
      result.forEach(user => {
        delete user.userPassword
      })
      res.json(result)
      console.log(result)
    }
  })
 })
});

/**Get specific user by id */

app.get('/users/:id', (req, res) => {
  let id = req.params.id;

  connection.connect((err) => {
    if (err) throw err;

    let query = `SELECT *
                 FROM users
                 WHERE userID = ?`;
    let values = [id]

    connection.query(query, values, (err, result) => {
      if (err) throw err;

      result.forEach(user => {
        delete user.userPassword
      })
        res.json(result)
    })
  })
})

app.post('/users/login', (req,res) =>{

  let userEmail = req.body.userEmail;
  let userPassword = req.body.userPassword;

  connection.connect((err) =>{
    if (err) {
      console.log("err", err);
      return res.status(500).json({ error: "Kan inte koppla upp till databasen." });
    }
    
    let query = "SELECT * FROM users WHERE userEmail = ? AND userPassword = ?";
    let values = [userEmail, userPassword];

    connection.query(query, values, (err, result) =>{
      console.log(result)
      if (err) console.log("err", err);

      let newResult = Object.keys(result).length
      if (newResult == 0){
        res.json(result[0]);
      }else {
        res.status(401).json({ error: "Fel användarnamn eller lösenord." });
      }
      
result.forEach(user => {
        console.log("Användarens id:", user);
        // res.send(user)
      });
    })
  })

})

// Create a new user
app.post('/users/add', function(req, res) {
  let userName = req.body.userName;
  let userEmail = req.body.userEmail;
  let userPassword = req.body.userPassword;
  let textColour = req.body.textColour;
  let userId = randomUUID();
  
  let sql = "INSERT into users (userId, userName, userEmail, userPassword, textColour) VALUES (?, ?, ?, ?, ?)";
  let values = [userId, userName, userEmail, userPassword, textColour];

  connection.query(sql, values, (err, data) => {
    if (err) console.log("err", err);
    res.json({ message: "Your account has been created"});
  })
})



io.on('connection', function(socket) {
    //console.log("lyckad kopplad", socket);

    socket.emit("chat", "hello world")

    socket.on("chat", (arg) =>{
        console.log("kommande chat", arg);
        io.emit("chat", arg);
    })

    socket.on("disconnect", function () {
        console.log("Användare frånkopplad");
    })
})



server.listen(process.env.PORT || '3000');