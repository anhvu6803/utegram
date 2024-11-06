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

  socket.on('likeComment', (commentId) => {
    // Phát sự kiện cập nhật lượt thích đến tất cả người dùng
    io.emit('updateLikesComment', { commentId });
  });

  socket.on('submitComment', (comment) => {
    // Phát sự kiện cập nhật lượt thích đến tất cả người dùng
    io.emit('updateComment', { comment });
  });

  socket.on('submitReply', (reply) => {
    // Phát sự kiện cập nhật lượt thích đến tất cả người dùng
    io.emit('updateReply', { reply });
  });
})

module.exports = { app, server, io };
