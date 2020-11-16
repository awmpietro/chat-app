"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var bodyParser = require('body-parser');
var express = require('express');
var _a = require('http'), createServer = _a.createServer, Server = _a.Server;
var MySocket = require('./controllers/socket');
var _b = require('./routes'), login = _b.login, register = _b.register;
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
        this.PORT = process.env.PORT || 7070;
        this.app = express();
        this.app.disable('x-powered-by');
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', req.header('Origin'));
            res.header('Access-Control-Allow-Credentials', true);
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            next();
        });
        this.server = createServer(this.app);
        this.routesInit();
        this.socket = new MySocket(this.server);
    }
    /*
     * @method: routesInit
     * This method creates the routes of the application.
     */
    App.prototype.routesInit = function () {
        this.app.route('/login').post(login);
        this.app.route('/register').post(register);
    };
    return App;
}());
// Instantiate and start server
var app = new App();
app.server.listen(app.PORT, function () {
    console.log("Server listening at " + app.PORT);
});
