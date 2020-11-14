"use strict";
require('dotenv').config();
var express = require('express');
var _a = require('http'), createServer = _a.createServer, Server = _a.Server;
var MySocket = require('./socket');
var App = /** @class */ (function () {
    function App() {
        this.PORT = process.env.PORT || 8000;
        this.app = express();
        this.server = createServer(this.app);
        this.routesInit();
        this.socket = new MySocket(this.server);
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
module.exports = App;
