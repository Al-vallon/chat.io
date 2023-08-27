const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);

const port = process.env.PORT || 3000;

const server = app.listen(`${port}`, () => {
    console.log("Server listening on port " + port);
}); 

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

let socketsConnected = new Set();

io.on('connection' ,onConnected);


function onConnected(socket) {
    console.log(socket.id);
    socketsConnected.add(socket.id);

    io.emit('clients-total', socketsConnected.size);

    socket.on('disconnect', () =>{
        console.log('disconnected', socket.id);
        socketsConnected.delete(socket.id);
        io.emit('clients-total', socketsConnected.size);
    }) 

    socket.on('message', (data) => {
        console.log('chat', data);
        socket.broadcast.emit('chat-message', data);
    });

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);
    });
}



//https://www.youtube.com/watch?v=cM8WpJbdfr0&list=PLdHg5T0SNpN09AlLBAYahKZUrAWsIL7No&index=4