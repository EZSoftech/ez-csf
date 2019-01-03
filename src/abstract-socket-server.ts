import * as config from 'config';
import { createServer, Server } from 'http';
import * as express from 'express';
import * as cors from 'cors';
import * as socketIO from 'socket.io';
import { Application } from 'express';

const DEFAULT_PORT = 7860;

export abstract class AbstractSocketServer {
  socketApp: express.Application;
  server: Server;
  io: socketIO.Server;

  public abstract onInitSocketServer(io: socketIO.Server): void;

  constructor() {
    this.socketApp = express();
    this.initConfig();
    this.onInitSocketServer(this.io);
  }

  initConfig(): void {
    this.socketApp.use(cors());
    this.server = createServer(this.socketApp);
    let port: number;
    if (config.has('socket')) {
      let socket = <any>config.get('socket');
      port = socket.port;
    }
    port = DEFAULT_PORT;
    this.server.listen(port, () => {
      console.log('Socket Server is running at port #' + port);
    });
    this.io = socketIO(this.server);
  }
}
