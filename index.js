const Websocket = require('ws');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');

// load env
require('dotenv').config();

const HttpHandler = require('./lib/http_handler');
const httpHandler = new HttpHandler();

const ChildIOStat = require('./lib/iostat');
const childIOStat = new ChildIOStat(interval = '2');

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

// init chat
require('./lib/socket')(listener, childIOStat);

// routes
app.get('/', httpHandler.index);

app.get('/connect', (req, res, next) => {
    childIOStat.connect();
    res.json({'message': 'success'});
});

app.get('/disconnect', (req, res, next) => {
    childIOStat.disconnect();
    res.json({'message': 'success'});
});

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