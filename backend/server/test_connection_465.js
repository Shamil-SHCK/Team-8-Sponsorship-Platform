import net from 'net';

console.log("Testing raw TCP connection to smtp.gmail.com:465...");

const socket = net.createConnection(465, 'smtp.gmail.com', () => {
    console.log('✅ Success! Node.js established a raw TCP connection on 465.');
    socket.end();
});

socket.on('error', (err) => {
    console.log('❌ Connection Failed on 465:', err.message);
});

socket.setTimeout(5000);
socket.on('timeout', () => {
    console.log('❌ Connection Timed Out (5s) on 465');
    socket.destroy();
});
