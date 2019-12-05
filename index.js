const Websocket = require('ws');
const express = require('express');

// load env
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);

const listener = new Websocket.Server({
    server: server
});

// init chat
require('./lib/socket')(listener);


// set PORT
const PORT = process.env.PORT;

// listen app on PORT
server.listen(PORT, err => {
    if (err) {
        console.log(`error on start up: ${err}`);
    } else {
        console.log(`app listen on port ${PORT}`);
    }
});