const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const wss = new WebSocket.Server({ port: +PORT, host: HOST });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log('received: %s', message);
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => console.log('Client disconnected'));
});

console.log(`WebSocket server is running on ws://${HOST}:${PORT}`);
