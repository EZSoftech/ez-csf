"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var path = require("path");
var cookieParser = require("cookie-parser");
var errorHandler = require("errorhandler");
var methodOverride = require("method-override");
var swaggerTools = require("swagger-tools");
var yaml = require("js-yaml");
var fs = require("fs");
var API_UI_PATH = '/api-docs';
var API_DOCS = '/docs';
var AbstractServer = /** @class */ (function () {
    function AbstractServer(config) {
        this.config = config;
        this.loadConfig();
        this.initApp();
        this.initAppConfig();
    }
    AbstractServer.prototype.loadConfig = function () {
        this.swaggerConfig = this.config.get('swagger');
        this.port = this.config.get('port');
    };
    AbstractServer.prototype.initApp = function () {
        this.app = express();
    };
    AbstractServer.prototype.initAppConfig = function () {
        var _this = this;
        var yamlPath = path.resolve(__dirname, this.swaggerConfig.yamlPath);
        var swaggerDefinition = yaml.safeLoad(fs.readFileSync(yamlPath, 'utf8'));
        var controllerPath = path.resolve(__dirname, this.swaggerConfig.controllerPath);
        this.app.set('port', this.port);
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(cookieParser('SECRET_GOES_HERE'));
        this.app.use(methodOverride());
        this.app.use(function (err, req, res, next) {
            err.status = 404;
            next(err);
        });
        this.app.use(errorHandler());
        swaggerTools.initializeMiddleware(swaggerDefinition, function (middleware) {
            _this.app.use(middleware.swaggerMetadata());
            _this.app.use(middleware.swaggerRouter({ useStubs: true, controllers: controllerPath }));
            _this.app.use(middleware.swaggerUi({
                apiDocs: _this.swaggerConfig.apiBaseUrl + API_DOCS,
                swaggerUi: _this.swaggerConfig.apiBaseUrl + API_UI_PATH
            }));
        });
    };
    return AbstractServer;
}());
exports.AbstractServer = AbstractServer;

//# sourceMappingURL=server.js.map
