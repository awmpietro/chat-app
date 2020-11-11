const express = require('express');
const { createServer, Server } = require('http');
const socketIo = require('socket.io');

class App {
  public app: any;
  public server: typeof Server;
  private io: SocketIO.Server;
  public PORT: number = 8080;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = socketIo(this.server);
    this.routes();
    this.listen();
  }

  routes() {
    this.app.route('/').get((req: any, res: any) => {
      res.sendFile(__dirname + '/index.html');
    });
  }

  private listen(): void {
    this.io.on('connection', (socket: any) => {
      console.log('a user connected');

      socket.on('chat message', function (msg: any) {
        console.log('message: ' + msg);
      });

      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  }
}

const app = new App();

app.server.listen(app.PORT, () => {
  console.log(`Server listening in" + ${app.PORT}`);
});
