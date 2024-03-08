const express = require('express');
const app = require('express')();
const server = require('http').createServer(app);
const connection = require('./lib/conn.js');
const logger = require('morgan');
const cors = require('cors');

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

//const usersRouter = require('./routes/users.js');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());


//app.use('/api/users', usersRouter);

app.get('/', function(req, res) {
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
      res.send(result)
      console.log(result)
    }
  })
 })
});

server.listen(process.env.PORT || '3000');