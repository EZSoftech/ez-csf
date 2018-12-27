"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const http_1 = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");
const DEFAULT_PORT = 7860;
class AbstractSocketServer {
    constructor() {
        this.socketApp = express();
        this.initConfig();
        this.onInitSocketServer(this.io);
    }
    initConfig() {
        this.socketApp.use(cors());
        this.server = http_1.createServer(this.socketApp);
        let port;
        if (config.has('socket')) {
            let socket = config.get('socket');
            port = socket.port;
        }
        port = DEFAULT_PORT;
        this.server.listen(port, () => {
            console.log('Socket Server is running at port #' + port);
        });
        this.io = socketIO(this.server);
    }
}
exports.AbstractSocketServer = AbstractSocketServer;

//# sourceMappingURL=abstract-socket-server.js.map
