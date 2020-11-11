"use strict";
var express = require('express');
var _a = require('http'), createServer = _a.createServer, Server = _a.Server;
var socketIo = require('socket.io');
var App = /** @class */ (function () {
    function App() {
        this.PORT = 8080;
        this.app = express();
        this.server = createServer(this.app);
        this.io = socketIo(this.server);
        this.routes();
        this.listen();
    }
    App.prototype.routes = function () {
        this.app.route('/').get(function (req, res) {
            res.sendFile(__dirname + '/index.html');
        });
    };
    App.prototype.listen = function () {
        this.io.on('connection', function (socket) {
            console.log('a user connected');
            socket.on('chat message', function (msg) {
                console.log('message: ' + msg);
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
    console.log("Server listening in\" + " + app.PORT);
});
