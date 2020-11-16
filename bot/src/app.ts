export {};
import 'dotenv/config';
import express from 'express';
import { createServer, Server } from 'http';
import Mq from './controllers/mq';
import { getStock } from './routes';

/*
 * @class: App
 * App is the main class, entry point of the application.
 */
class App {
  public app: express.Application;
  public server: any;
  public PORT: any = process.env.PORT || 6060;
  private mq: Mq;

  /*
   * @method: constructor
   * The constructor memthod handles all initializations needed when an object is instatiated.
   */
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

  /*
   * @method: routesInit
   * This method creates the routes of the application.
   */
  routesInit() {
    this.app.route('/get-stock').get(getStock);
  }
}

// Instantiate and start server
const app = new App();

app.server.listen(app.PORT, () => {
  console.log(`Bot listening at ${app.PORT}`);
});
