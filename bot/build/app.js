"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var express = require('express');
var _a = require('http'), createServer = _a.createServer, Server = _a.Server;
var Mq = require('./mq');
var getStock = require('./routes').getStock;
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.PORT = process.env.PORT || 6060;
        this.app = express();
        this.server = createServer(this.app);
        this.mq = new Mq();
        this.app.use(function (req, res, next) {
            res.locals = {
                mq: _this.mq,
            };
            return next();
        });
        this.routesInit();
    }
    App.prototype.routesInit = function () {
        this.app.route('/get-stock').get(getStock);
    };
    return App;
}());
var app = new App();
app.server.listen(app.PORT, function () {
    console.log("Bot listening at " + app.PORT);
});
