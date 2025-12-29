import net from 'net';

console.log("Testing raw TCP connection to smtp.gmail.com:587...");

const socket = net.createConnection(587, 'smtp.gmail.com', () => {
    console.log('✅ Success! Node.js established a raw TCP connection.');
    socket.end();
});

socket.on('error', (err) => {
    console.log('❌ Connection Failed:', err.message);
    console.log('Full Error:', err);
});

socket.setTimeout(5000);
socket.on('timeout', () => {
    console.log('❌ Connection Timed Out (5s)');
    socket.destroy();
});
