export {};
require('dotenv').config();
const express = require('express');
const { createServer, Server } = require('http');
const Mq = require('./mq');
const { getStock } = require('./routes');

class App {
  public app: any;
  public server: typeof Server;
  public PORT: any = process.env.PORT || 6060;
  private mq: typeof Mq;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.mq = new Mq();
    this.app.use((req: any, res: any, next: any) => {
      res.locals = {
        mq: this.mq,
      };
      return next();
    });
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
