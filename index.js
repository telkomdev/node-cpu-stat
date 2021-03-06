const Websocket = require('ws');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');

// load env
require('dotenv').config();

const ChildIOStat = require('./lib/iostat');
const childIOStat = new ChildIOStat(interval = '2');

const httpHandler = require('./lib/http_handler');

const app = express();

//view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const server = require('http').createServer(app);

const listener = new Websocket.Server({
    server: server
});

// init socket
require('./lib/socket')(listener, childIOStat);

// routes
app.use('/', httpHandler(childIOStat));

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