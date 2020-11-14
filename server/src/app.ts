export {};
require('dotenv').config();
const express = require('express');
const { createServer, Server } = require('http');

const MySocket = require('./controllers/socket');
const { login, register } = require('./routes');

class App {
  public app: any;
  public server: typeof Server;
  private socket: typeof MySocket;
  public PORT: any = process.env.PORT || 7070;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.routesInit();
    this.socket = new MySocket(this.server);
  }

  routesInit() {
    this.app.route('/login').post(login);
    this.app.route('/register').post(register);
  }
}

const app = new App();

app.server.listen(app.PORT, () => {
  console.log(`Server listening at ${app.PORT}`);
});
