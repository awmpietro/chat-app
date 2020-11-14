"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var express = require('express');
var _a = require('http'), createServer = _a.createServer, Server = _a.Server;
var MySocket = require('./controllers/socket');
var _b = require('./routes'), login = _b.login, register = _b.register;
var App = /** @class */ (function () {
    function App() {
        this.PORT = process.env.PORT || 7070;
        this.app = express();
        this.server = createServer(this.app);
        this.routesInit();
        this.socket = new MySocket(this.server);
    }
    App.prototype.routesInit = function () {
        this.app.route('/login').post(login);
        this.app.route('/register').post(register);
    };
    return App;
}());
var app = new App();
app.server.listen(app.PORT, function () {
    console.log("Server listening at " + app.PORT);
});
