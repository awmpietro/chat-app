"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var socketIo = require('socket.io');
var moment = require('moment');
var axios = require('axios');
var csv = require('csv-parser');
var fs = require('fs');
var AppUsers = require('./users');
var Socket = /** @class */ (function () {
    function Socket(server) {
        var _this = this;
        this.chatBotName = 'Chat App';
        this.checkStock = function (message) {
            return message.startsWith('/stock=');
        };
        this.joinRoom = function (socket, userName, userRoom) {
            var user = _this.users.userJoin(socket.id, userName, userRoom);
            socket.join(user.userRoom);
            /* Bots */
            socket.emit('newMessage', {
                user: {
                    userId: socket.id,
                    userName: _this.chatBotName,
                    userRoom: userRoom,
                },
                message: 'Welcome to Chat App',
                date: moment().format('MM/DD/YY HH:mm:ss'),
            }); // only the client
            socket.broadcast.to(user.userRoom).emit('newMessage', {
                user: {
                    userId: socket.id,
                    userName: _this.chatBotName,
                    userRoom: userRoom,
                },
                message: user.userName + " has joined the chat",
                date: moment().format('MM/DD/YYYY HH:mm:ss'),
            }); // everybody but the client
        };
        this.message = function (socket, msg) {
            var user = _this.users.getUser(socket.id);
            if (_this.checkStock(msg.msg)) {
                var fmtMsg_1 = msg.msg.split('=');
                var url = "https://stooq.com/q/l/?s=" + fmtMsg_1[1] + "&f=sd2t2ohlcv&h&e=csv";
                var results_1 = [];
                axios
                    .get(url, {
                    method: 'get',
                    responseType: 'stream',
                })
                    .then(function (res) {
                    res.data.pipe(fs.createWriteStream('file.csv'));
                    fs.createReadStream('file.csv')
                        .pipe(csv())
                        .on('data', function (data) { return results_1.push(data); })
                        .on('end', function () {
                        if (results_1[0].Close === 'N/D') {
                            var message = {
                                user: user,
                                message: "Stock not found",
                                date: moment().format('MM/DD/YYYY HH:mm:ss'),
                            };
                            socket.emit('newMessage', message); // everybody including client
                        }
                        else {
                            var message = {
                                user: user,
                                message: fmtMsg_1[1].toUpperCase() + " quote is $" + results_1[0].Close + " per share",
                                date: moment().format('MM/DD/YYYY HH:mm:ss'),
                            };
                            _this.io.emit('newMessage', message); // everybody including client
                        }
                    });
                })
                    .catch(function (err) { return console.log('Error: ' + err.message); });
            }
            else {
                var message = {
                    user: user,
                    message: msg.msg,
                    date: moment().format('MM/DD/YYYY HH:mm:ss'),
                };
                _this.io.emit('newMessage', message); // everybody including client
            }
        };
        this.disconnect = function (socket) {
            var leftUser = _this.users.userLeft(socket.id);
            if (leftUser) {
                _this.io.to(leftUser.userRoom).emit('newMessage', {
                    user: {
                        userId: socket.id,
                        userName: _this.chatBotName,
                        userRoom: leftUser.userRoom,
                    },
                    message: leftUser.userName + " has left the chat",
                    date: moment().format('MM/DD/YY HH:mm:ss'),
                });
            }
        };
        this.socketInit = function () {
            _this.io.on('connection', function (socket) {
                socket.on('joinRoom', function (_a) {
                    var userName = _a.userName, userRoom = _a.userRoom;
                    _this.joinRoom(socket, userName, userRoom);
                });
                /* Users */
                socket.on('message', function (msg) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        this.message(socket, msg);
                        return [2 /*return*/];
                    });
                }); });
                socket.on('disconnect', function () {
                    _this.disconnect(socket);
                });
            });
        };
        this.io = socketIo(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
                credentials: true,
            },
        });
        this.users = new AppUsers();
        this.socketInit();
    }
    return Socket;
}());
module.exports = Socket;
