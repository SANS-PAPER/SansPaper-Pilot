const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// Enable CORS for specific origin (adjust to your frontend's URL)
app.use(cors({
  origin: 'http://localhost:3000', // Or your deployed frontend URL
  methods: ['GET', 'POST'], // You can allow other methods if necessary
  credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Or your frontend's URL
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Define an array to store messages
const messages = [];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    // Send all stored messages to the newly connected client
    socket.emit('previousMessages', messages);
  
    socket.on('sendMessage', (message) => {
      console.log('Received message:', message);
      // Store the message in the array
      messages.push(message);
      io.emit('receiveMessage', message); // Broadcast the message to all clients
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
});

server.listen(4000, () => {
    console.log('Socket server is running on port 4000');
});
