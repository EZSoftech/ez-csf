"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_server_1 = require("./abstract-server");
var Server = /** @class */ (function (_super) {
    __extends(Server, _super);
    function Server() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Server.bootstrap = function () {
        return new Server();
    };
    Server.prototype.getConfig = function () {
        return {
            port: 4000,
            swagger: {
                apiBaseUrl: '/ez-csf/v1',
                yamlPath: './api.yaml',
                controllerPath: './controllers',
                protectedEndpoints: [
                    '/ez-csf/v1/auth/login'
                ],
                corsEndpoints: []
            }
        };
    };
    return Server;
}(abstract_server_1.AbstractServer));
exports.Server = Server;

//# sourceMappingURL=server.js.map
