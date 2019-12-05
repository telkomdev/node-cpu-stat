const WebSocket = require('ws');

const broadcastMessage = (listener, message) => {
    listener.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

module.exports = (listener) => {

    listener.on('connection', (socket, req) => {

        socket.on('message', async (message) => {
            const msg = JSON.parse(message);
            console.log(msg.type);
        });

        socket.on('close', (e) => {
            console.log('connection closed ', e);
        });

        socket.on('error', (e) => {
            console.log('connection error ', e);
        });

    });
};