const WebSocket = require('ws');

const broadcastMessage = (listener, message) => {
    listener.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

module.exports = (listener, childIOStat) => {

    listener.on('connection', (socket, req) => {

        socket.on('message', (message) => {
            const msg = JSON.parse(message);
            console.log(msg);
        });

        console.log(childIOStat.isConnected());
        
        if (childIOStat.isConnected()) {
            childIOStat.execCommand((data, error) => {
                if (error) {
                    console.log(error);
                } else {
                    broadcastMessage(listener, data);
                }
            });
        }

        socket.on('close', (e) => {
            console.log('connection closed ', e);
        });

        socket.on('error', (e) => {
            console.log('connection error ', e);
        });

    });
};