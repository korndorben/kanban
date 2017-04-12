var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config.js');

var us = require('./routes/us');
var task = require('./routes/task');
var doc = require('./routes/doc');
var user = require('./routes/user');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var redis = require('socket.io-redis');
io.adapter(redis({
    host: config.redis.host,
    port: config.redis.port,
    key: 'socket.io'
}));
var nsp = io.of('/hubot');
nsp.on('connection', function(socket) {
    socket.on('join', function(data) {
        socket.join(data.uuid);
    });
});
app.use(function(req, res, next) {
    res.io = nsp;
    next();
});

app.engine('.html', require('ejs').__express);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/markdown')));

app.use('/', us);
app.use('/', user);
app.use('/doc', doc);
app.use('/task', task);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = {
    app: app,
    server: server
};
