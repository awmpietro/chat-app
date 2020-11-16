"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var body_parser_1 = __importDefault(require("body-parser"));
var express_1 = __importDefault(require("express"));
var http_1 = require("http");
var socket_1 = __importDefault(require("./controllers/socket"));
var routes_1 = require("./routes");
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
        this.app = express_1.default();
        this.app.disable('x-powered-by');
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: false }));
        this.app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', req.header('Origin'));
            res.header('Access-Control-Allow-Credentials', true);
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            next();
        });
        this.server = http_1.createServer(this.app);
        this.routesInit();
        this.socket = new socket_1.default(this.server);
    }
    /*
     * @method: routesInit
     * This method creates the routes of the application.
     */
    App.prototype.routesInit = function () {
        this.app.route('/login').post(routes_1.login);
        this.app.route('/register').post(routes_1.register);
    };
    return App;
}());
// Instantiate and start server
var app = new App();
app.server.listen(app.PORT, function () {
    console.log("Server listening at " + app.PORT);
});
