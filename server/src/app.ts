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
    this.io = socketIo(this.server);
    this.routesInit();
    this.socketInit();
  }

  routesInit() {
    this.app.route('/').get((req: any, res: any) => {
      res.json('Working');
    });
  }

  private socketInit(): void {
    this.io.on('connection', (socket: any) => {
      console.log('a user connected');

      socket.on('chat message', function (msg: any) {
        socket.emit('newMessage', msg);
      });

      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  }
}

const app = new App();

app.server.listen(app.PORT, () => {
  console.log(`Server listening at ${app.PORT}`);
});
