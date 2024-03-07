/*var express = require('express');
const router = express.Router();
const cors = require('cors')();*/
const express = require('express');
const app = require('express')();
const server = require('http').createServer(app);
const connection = require('./lib/conn.js');
const logger = require('morgan');
const cors = require('cors')


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

const usersRouter = require('./routes/users');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());


app.get('/', (req, res) => {

    res.send('detta funkar')
})

app.use('/api/users', usersRouter);

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