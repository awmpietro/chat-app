export {};
import 'dotenv/config';
import socketIo from 'socket.io';
import { Server } from 'http';
import moment from 'moment';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import Mq from './mq';

import Users from './users';
/*
 * @class: Socket
 * Socket is responsible for managing socketio connections and exchangin messages throught websockets.
 * @params: server: instance of the webserver created by Express.
 */
class Socket {
  private io: socketIo.Server;
  private chatBotName: string = 'Chat App';
  public users: Users;
  private mq: Mq;

  /*
   * @method: constructor
   * The constructor method handles all initializations needed when an object is instatiated.
   */
  constructor(server: Server) {
    this.io = new socketIo.Server(server, {
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

  /*
   * @method: socketInit
   * This method creates the socket connection and listen to the socket events, routing to methods.
   */
  socketInit = (): void => {
    this.io
      .use((socket: any, next: any) => {
        if (socket.handshake.query && socket.handshake.query.token) {
          jwt.verify(
            socket.handshake.query.token,
            String(process.env.SECRET_KEY),
            (err: any, decoded: any) => {
              if (err) return next(new Error('Authentication error'));
              socket.decoded = decoded;
              next();
            },
          );
        } else {
          next(new Error('Authentication error'));
        }
      })
      .on('connection', (socket: any) => {
        socket.on(
          'joinRoom',
          ({
            userName,
            userRoom,
          }: {
            userName: string;
            userRoom: string;
          }) => {
            this.joinRoom(socket, userName, userRoom);
          },
        );

        /* Users */
        socket.on('message', (msg: any) => {
          this.message(socket, msg);
        });

        socket.on('disconnect', () => {
          this.disconnect(socket);
        });
      });
  };

  /*
   * @method: joinRoom
   * This method is called when user first log into chat, and put the user in a room.
   * @params: socket: instance of incoming socket, userName: name of the incoming user, userRoom: room of the incoming user
   */
  joinRoom = (socket: any, userName: string, userRoom: string) => {
    const user = this.users.userJoin(socket.id, userName, userRoom);
    socket.join(user.userRoom);

    socket.emit('newMessage', {
      user: {
        userId: socket.id,
        userName: this.chatBotName,
        userRoom,
      },
      message: 'Welcome to Chat App',
      date: moment().format('MM/DD/YY HH:mm:ss'),
    }); // only the client

    socket.broadcast.to(user.userRoom).emit('newMessage', {
      user: {
        userId: socket.id,
        userName: this.chatBotName,
        userRoom,
      },
      message: `${user.userName} has joined the chat`,
      date: moment().format('MM/DD/YYYY HH:mm:ss'),
    }); // everybody but the client
    this.io.to(user.userRoom).emit('newUser', {
      users: this.users.roomUsers(user.userRoom),
    });
  };

  /*
   * @method: message
   * This method is called when an user emits a message.
   * @params: socket: instance of incoming socket, msg: message to send in chat
   */
  message = (socket: any, msg: any) => {
    const user = this.users.getUser(socket.id);
    if (msg.msg.startsWith('/stock=')) {
      const fmtMsg: string[] = msg.msg.split('=');
      // Send to bot, bot will queue the message
      axios
        .get(`${process.env.BOT_URL}/get-stock?stock=${fmtMsg[1]}`)
        .catch((error: Error) => {
          console.log(error);
        });

      // Subscribe here  to receive stock messages from queue
      this.mq.consume('jobs', (results: any) => {
        const res = JSON.parse(results.content.toString());
        const message = {
          user,
          message: res.stock,
          date: moment().format('MM/DD/YYYY HH:mm:ss'),
        };
        if (res.found) {
          this.io.emit('newMessage', message);
        } else {
          socket.emit('newMessage', message);
        }
      });
    } else {
      const message = {
        user,
        message: msg.msg,
        date: moment().format('MM/DD/YYYY HH:mm:ss'),
      };
      this.io.emit('newMessage', message);
    }
  };

  /*
   * @method: disconnect
   * This method is called when an user leaves the chat.
   * @params: socket: instance of incoming socket.
   */
  disconnect = (socket: any) => {
    const leftUser = this.users.userLeft(socket.id);
    if (leftUser) {
      this.io.to(leftUser.userRoom).emit('newMessage', {
        user: {
          userId: socket.id,
          userName: this.chatBotName,
          userRoom: leftUser.userRoom,
        },
        message: `${leftUser.userName} has left the chat`,
        date: moment().format('MM/DD/YY HH:mm:ss'),
      });
      this.io.to(leftUser.userRoom).emit('newUser', {
        users: this.users.roomUsers(leftUser.userRoom),
      });
    }
  };
}

export default Socket;
