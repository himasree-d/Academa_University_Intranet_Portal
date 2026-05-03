const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

let io;
const users = new Map(); // userId -> socketId

const init = (server) => {
  io = socketIo(server, {
    cors: {
      origin: true, // Allow all origins
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['polling', 'websocket'] // polling first for Render compatibility
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.user = decoded;
      next();
    });
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    users.set(userId, socket.id);
    console.log(`User connected: ${userId} (Socket: ${socket.id})`);

    // Broadcast that this user is online
    io.emit('user_status_change', { userId, status: 'online' });
    
    // Send current online users to the new connection
    socket.emit('current_online_users', Array.from(users.keys()));

    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room: ${roomId}`);
    });

    socket.on('typing', (data) => {
      // data: { receiverId, groupId, isTyping }
      if (data.groupId) {
        socket.to(`group_${data.groupId}`).emit('display_typing', { userId, userName: socket.user.name, ...data });
      } else if (data.receiverId) {
        const receiverSocketId = users.get(data.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('display_typing', { userId, userName: socket.user.name, ...data });
        }
      }
    });

    socket.on('disconnect', () => {
      users.delete(userId);
      console.log(`User disconnected: ${userId}`);
      io.emit('user_status_change', { userId, status: 'offline' });
    });
  });

  return io;
};

const getIo = () => {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
};

const getSocketId = (userId) => users.get(userId);

module.exports = { init, getIo, getSocketId };
