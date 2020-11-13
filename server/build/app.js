"use strict";
require('dotenv').config();
var express = require('express');
var _a = require('http'), createServer = _a.createServer, Server = _a.Server;
var socketIo = require('socket.io');
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.PORT = process.env.PORT || 8000;
        this.socketInit = function () {
            _this.io.on('connection', function (socket) {
                console.log('a user connected');
                socket.emit('newMessage', 'Welcome to Chat App'); // the client
                socket.broadcast.emit('message', 'An user has joined the chat'); // evrybody but the client
                socket.on('message', function (msg) {
                    _this.io.emit('newMessage', msg.msg); // everybody
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
        this.app.route('/').get(function (req, res) {
            res.json('Working');
        });
    };
    return App;
}());
var app = new App();
app.server.listen(app.PORT, function () {
    console.log("Server listening at " + app.PORT);
});
