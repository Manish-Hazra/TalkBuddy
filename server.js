const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {formatMessage,
  formatMessageI} = require('./utils/messages');
const {
  userJoin,
  userJoinG,
  getCurrentUser,
  getCurrentUserG,
  userLeave,
  userLeaveG,
  getRoomUsers,
  getRoomUsersG,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.get('/private', (req, res)=>{
  app.render('private.html')
})

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Talk Buddy';
const globalRoom = 'global'

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    const userg = userJoinG(socket.id, username, globalRoom);
    socket.join(user.room);
    socket.join(userg.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to Talk Buddy!'));
    socket.emit('messageG', formatMessage(botName, 'Welcome to Talk Buddy!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );
      socket.broadcast
      .to(userg.room)
      .emit(
        'messageG',
        formatMessage(botName, `${userg.username} has joined the chat`)
      );
    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
    io.to(userg.room).emit('roomUsersG', {
      users: getRoomUsersG(userg.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });
  socket.on('chatMessageG', msg => {
    const user = getCurrentUserG(socket.id);

    io.to(user.room).emit('messageG', formatMessage(user.username, msg));
  });

  socket.on('chatMessageI', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('messageI', formatMessage(user.username, msg));
  });

  socket.on('chatMessageGI', msg => {
    const user = getCurrentUserG(socket.id);

    io.to(user.room).emit('messageGI', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    const userG = userLeaveG(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
    if (userG) {
      io.to(userG.room).emit(
        'messageG',
        formatMessage(botName, `${userG.username} has left the chat`)
      );

      // Send users and room info
      io.to(userG.room).emit('roomUsers', {
        room: userG.room,
        users: getRoomUsersG(userG.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
