"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socketIo = require('socket.io');
var moment = require('moment');
var axios = require('axios');
var jwt = require('jsonwebtoken');
var Mq = require('./mq');
var Users = require('./users');
/*
 * @class: Socket
 * Socket is responsible for managing socketio connections and exchangin messages throught websockets.
 * @params: server: instance of the webserver created by Express.
 */
var Socket = /** @class */ (function () {
    /*
     * @method: constructor
     * The constructor method handles all initializations needed when an object is instatiated.
     */
    function Socket(server) {
        var _this = this;
        this.chatBotName = 'Chat App';
        /*
         * @method: socketInit
         * This method creates the socket connection and listen to the socket events, routing to methods.
         */
        this.socketInit = function () {
            _this.io
                .use(function (socket, next) {
                if (socket.handshake.query && socket.handshake.query.token) {
                    jwt.verify(socket.handshake.query.token, process.env.SECRET_KEY, function (err, decoded) {
                        if (err)
                            return next(new Error('Authentication error'));
                        socket.decoded = decoded;
                        next();
                    });
                }
                else {
                    next(new Error('Authentication error'));
                }
            })
                .on('connection', function (socket) {
                socket.on('joinRoom', function (_a) {
                    var userName = _a.userName, userRoom = _a.userRoom;
                    _this.joinRoom(socket, userName, userRoom);
                });
                /* Users */
                socket.on('message', function (msg) {
                    _this.message(socket, msg);
                });
                socket.on('disconnect', function () {
                    _this.disconnect(socket);
                });
            });
        };
        /*
         * @method: joinRoom
         * This method is called when user first log into chat, and put the user in a room.
         * @params: socket: instance of incoming socket, userName: name of the incoming user, userRoom: room of the incoming user
         */
        this.joinRoom = function (socket, userName, userRoom) {
            var user = _this.users.userJoin(socket.id, userName, userRoom);
            socket.join(user.userRoom);
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
            _this.io.to(user.userRoom).emit('newUser', {
                users: _this.users.roomUsers(user.userRoom),
            });
        };
        /*
         * @method: message
         * This method is called when an user emits a message.
         * @params: socket: instance of incoming socket, msg: message to send in chat
         */
        this.message = function (socket, msg) {
            var user = _this.users.getUser(socket.id);
            if (msg.msg.startsWith('/stock=')) {
                var fmtMsg = msg.msg.split('=');
                // Send to bot, bot will queue the message
                axios
                    .get(process.env.BOT_URL + "/get-stock?stock=" + fmtMsg[1])
                    .catch(function (error) {
                    console.log(error);
                });
                // Subscribe here  to receive stock messages from queue
                _this.mq.consume('jobs', function (results) {
                    var res = JSON.parse(results.content.toString());
                    var message = {
                        user: user,
                        message: res.stock,
                        date: moment().format('MM/DD/YYYY HH:mm:ss'),
                    };
                    if (res.found) {
                        _this.io.emit('newMessage', message);
                    }
                    else {
                        socket.emit('newMessage', message);
                    }
                });
            }
            else {
                var message = {
                    user: user,
                    message: msg.msg,
                    date: moment().format('MM/DD/YYYY HH:mm:ss'),
                };
                _this.io.emit('newMessage', message);
            }
        };
        /*
         * @method: disconnect
         * This method is called when an user leaves the chat.
         * @params: socket: instance of incoming socket.
         */
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
                _this.io.to(leftUser.userRoom).emit('newUser', {
                    users: _this.users.roomUsers(leftUser.userRoom),
                });
            }
        };
        this.io = socketIo(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
                credentials: true,
            },
        });
        this.users = new Users();
        this.mq = new Mq();
        this.socketInit();
    }
    return Socket;
}());
module.exports = Socket;
