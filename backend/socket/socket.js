const { Server } = require('socket.io')
const express = require('express');
const cors = require('cors')
const http = require('http');

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  socket.on('likePost', (postId) => {
    io.emit('updateLikes', { postId });
  });
  socket.on('sendMessage', (message) => {
    socket.broadcast.emit('newMessage', message);
  });

  socket.on('joinRoom', ({ userId, otherUserId }) => {
    socket.join(`${userId}-${otherUserId}`);
  });
})
module.exports = { app, server, io };
