const io = require('socket.io-client');

// Conectar ao WebSocket no servidor NestJS
const socket = io('http://localhost:3000', { query: { userId: "3b4541af-6630-41d7-8de2-f44f108f5592" } });

socket.on('connect', () => {
  console.log('Connected to WebSocket as user 1');

  // Enviar uma mensagem para o userId 2
  socket.emit('sendMessage', {
    senderId: "3b4541af-6630-41d7-8de2-f44f108f5592",
    receiverId: "fe034138-51bd-4aec-8630-50ec98c4e260",
    content: 'Fuck you user 1!',
  });

  console.log('Message sent from user 1 to user 2');
});

// Receber mensagens em tempo real
socket.on('receiveMessage', (message) => {
  console.log('New message received:', message);
});

// Em caso de erro de conexão
socket.on('connect_error', (err) => {
  console.log('Connection error:', err);
});
