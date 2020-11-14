export {};
require('dotenv').config();
const express = require('express');
const { createServer, Server } = require('http');

const { getStock } = require('./routes');

class App {
  public app: any;
  public server: typeof Server;
  public PORT: any = process.env.PORT || 6060;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.routesInit();
  }

  routesInit() {
    this.app.route('/get-stock').get(getStock);
  }
}

const app = new App();

app.server.listen(app.PORT, () => {
  console.log(`Bot listening at ${app.PORT}`);
});
