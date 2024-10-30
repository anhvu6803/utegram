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
    // Phát sự kiện cập nhật lượt thích đến tất cả người dùng
    io.emit('updateLikes', { postId });
  });
})

module.exports = { app, server, io };
