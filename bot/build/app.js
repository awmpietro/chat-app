"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var express_1 = __importDefault(require("express"));
var http_1 = require("http");
var mq_1 = __importDefault(require("./controllers/mq"));
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
        var _this = this;
        this.PORT = process.env.PORT || 6060;
        this.app = express_1.default();
        this.server = http_1.createServer(this.app);
        this.mq = new mq_1.default();
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
        this.app.route('/get-stock').get(routes_1.getStock);
    };
    return App;
}());
// Instantiate and start server
var app = new App();
app.server.listen(app.PORT, function () {
    console.log("Bot listening at " + app.PORT);
});
