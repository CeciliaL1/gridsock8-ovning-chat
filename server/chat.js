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

const usersRouter = require('./routes/users.js');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());


app.use('/api/users', usersRouter);


app.get('/', (req, res) => {

    res.send('detta funkar')
})



server.listen(process.env.PORT || '3000');