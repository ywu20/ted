// Create WebSocket connection.
const socket = new WebSocket("ws://127.0.0.1:5678/");

// Connection opened
socket.addEventListener('open', function (event) {
    alert("open");
    socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', function (event) {
    alert("message");
    console.log('Message from server ', event.data);
});
