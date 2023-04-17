const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.send('<p>NodeJS server is working, nothing to see here.</p>');
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/test/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  // Réception d'un message
  socket.on('message', (message) => {
    console.log('message received', message);

    // Envoi du message à tous les clients connectés
    io.emit('message', message);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});