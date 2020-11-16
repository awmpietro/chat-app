"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var express = require('express');
var _a = require('http'), createServer = _a.createServer, Server = _a.Server;
var Mq = require('./controllers/mq');
var getStock = require('./routes').getStock;
/*
 * @class: App
 * App is the main class, entry point of the application.
 */
var App = /** @class */ (function () {
    /*
     * @method: constructor
     * The constructor memthod handles all initializations needed when an object is instatiated.
     */
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
    /*
     * @method: routesInit
     * This method creates the routes of the application.
     */
    App.prototype.routesInit = function () {
        this.app.route('/get-stock').get(getStock);
    };
    return App;
}());
// Instantiate and start server
var app = new App();
app.server.listen(app.PORT, function () {
    console.log("Bot listening at " + app.PORT);
});
