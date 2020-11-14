require('dotenv').config();
const express = require('express');
const { createServer, Server } = require('http');

const MySocket = require('./socket');

class App {
  public app: any;
  public server: typeof Server;
  private socket: typeof MySocket;
  public PORT: any = process.env.PORT || 8000;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.routesInit();
    this.socket = new MySocket(this.server);
  }

  routesInit() {
    this.app.route('/login').post((req: any, res: any) => {
      res.json('Working');
    });

    this.app.route('/register').post((req: any, res: any) => {
      res.json('Working');
    });
  }
}
module.exports = App;
