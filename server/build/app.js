"use strict";
require('dotenv').config();
var express = require('express');
var _a = require('http'), createServer = _a.createServer, Server = _a.Server;
var socketIo = require('socket.io');
var App = /** @class */ (function () {
    function App() {
        this.PORT = process.env.PORT || 8000;
        this.app = express();
        this.server = createServer(this.app);
        this.io = socketIo(this.server);
        this.routesInit();
        this.socketInit();
    }
    App.prototype.routesInit = function () {
        this.app.route('/').get(function (req, res) {
            res.json('Working');
        });
    };
    App.prototype.socketInit = function () {
        this.io.on('connection', function (socket) {
            console.log('a user connected');
            socket.on('chat message', function (msg) {
                socket.emit('newMessage', msg);
            });
            socket.on('disconnect', function () {
                console.log('user disconnected');
            });
        });
    };
    return App;
}());
var app = new App();
app.server.listen(app.PORT, function () {
    console.log("Server listening at " + app.PORT);
});
