require('dotenv').config();
const express = require('express');
const { createServer, Server } = require('http');
const socketIo = require('socket.io');
const moment = require('moment');

class App {
  public app: any;
  public server: typeof Server;
  private io: SocketIO.Server;
  public PORT: any = process.env.PORT || 8000;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = socketIo(this.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    this.routesInit();
    this.socketInit();
  }

  routesInit() {
    this.app.route('/login').post((req: any, res: any) => {
      res.json('Working');
    });

    this.app.route('/register').post((req: any, res: any) => {
      res.json('Working');
    });
  }

  socketInit = (): void => {
    this.io.on('connection', (socket: any) => {
      console.log('a user connected');

      socket.emit('newMessage', {
        message: 'Welcome to Chat App',
        date: moment().format('MM/DD/YYYY HH:mm:ss'),
      }); // the client

      socket.broadcast.emit('newMessage', {
        message: 'An user has joined the chat',
        date: moment().format('MM/DD/YYYY HH:mm:ss'),
      }); // evrybody but the client

      socket.on('message', (msg: any) => {
        const message = {
          message: msg.msg,
          date: moment().format('MM/DD/YYYY HH:mm:ss'),
        };
        this.io.emit('newMessage', message); // everybody
      });

      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  };
}

const app = new App();

app.server.listen(app.PORT, () => {
  console.log(`Server listening at ${app.PORT}`);
});
