require('dotenv').config();
const express = require('express');
const { createServer, Server } = require('http');
const socketIo = require('socket.io');

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
    this.app.route('/').get((req: any, res: any) => {
      res.json('Working');
    });
  }

  socketInit = (): void => {
    this.io.on('connection', (socket: any) => {
      console.log('a user connected');

      socket.emit('newMessage', 'Welcome to Chat App'); // the client
      socket.broadcast.emit('message', 'An user has joined the chat'); // evrybody but the client

      socket.on('message', (msg: any) => {
        this.io.emit('newMessage', msg.msg); // everybody
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
