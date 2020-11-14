"use strict";
require('dotenv').config();
var express = require('express');
var _a = require('http'), createServer = _a.createServer, Server = _a.Server;
var socketIo = require('socket.io');
var moment = require('moment');
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.PORT = process.env.PORT || 8000;
        this.socketInit = function () {
            _this.io.on('connection', function (socket) {
                console.log('a user connected');
                socket.emit('newMessage', {
                    message: 'Welcome to Chat App',
                    date: moment().format('MM/DD/YYYY HH:mm:ss'),
                }); // the client
                socket.broadcast.emit('newMessage', {
                    message: 'An user has joined the chat',
                    date: moment().format('MM/DD/YYYY HH:mm:ss'),
                }); // evrybody but the client
                socket.on('message', function (msg) {
                    var message = {
                        message: msg.msg,
                        date: moment().format('MM/DD/YYYY HH:mm:ss'),
                    };
                    _this.io.emit('newMessage', message); // everybody
                });
                socket.on('disconnect', function () {
                    console.log('user disconnected');
                });
            });
        };
        this.app = express();
        this.server = createServer(this.app);
        this.io = socketIo(this.server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
                credentials: true,
            },
        });
        this.routesInit();
        this.socketInit();
    }
    App.prototype.routesInit = function () {
        this.app.route('/login').post(function (req, res) {
            res.json('Working');
        });
        this.app.route('/register').post(function (req, res) {
            res.json('Working');
        });
    };
    return App;
}());
var app = new App();
app.server.listen(app.PORT, function () {
    console.log("Server listening at " + app.PORT);
});
