export {};
import 'dotenv/config';
import bodyParser from 'body-parser';
import express from 'express';
import { createServer, Server } from 'http';

import Socket from './controllers/socket';
import { login, register } from './routes';

/*
 * @class: App
 * App is the main class, entry point of the application.
 */
class App {
  public app: express.Application;
  public server: any;
  private socket: Socket;
  public PORT: any = process.env.PORT || 7070;

  /*
   * @method: constructor
   * The constructor memthod handles all initializations needed when an object is instatiated.
   */
  constructor() {
    this.app = express();
    this.app.disable('x-powered-by');
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use((req: any, res: any, next: any) => {
      res.header('Access-Control-Allow-Origin', req.header('Origin'));
      res.header('Access-Control-Allow-Credentials', true);
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
      );
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, DELETE',
      );
      next();
    });
    this.server = createServer(this.app);
    this.routesInit();
    this.socket = new Socket(this.server);
  }

  /*
   * @method: routesInit
   * This method creates the routes of the application.
   */
  routesInit() {
    this.app.route('/login').post(login);
    this.app.route('/register').post(register);
  }
}

// Instantiate and start server
const app = new App();

app.server.listen(app.PORT, () => {
  console.log(`Server listening at ${app.PORT}`);
});
