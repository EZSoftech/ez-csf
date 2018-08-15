"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_server_1 = require("./abstract-server");
const path = require("path");
class Server extends abstract_server_1.AbstractServer {
    static bootstrap() {
        return new Server();
    }
    getConfig() {
        return {
            port: 4000,
            swagger: {
                apiBaseUrl: '/ez-csf/v1',
                yamlPath: path.resolve(__dirname, './api.yaml'),
                controllerPath: path.resolve(__dirname, './controllers'),
                protectedEndpoints: [
                    '/get-user-info',
                    '/users'
                ],
                corsEndpoints: []
            },
            db: {
                host: 'localhost',
                user: 'root',
                password: 'Admin',
                database: 'cp_navigation_dev'
            }
        };
    }
}
exports.Server = Server;

//# sourceMappingURL=server.js.map
