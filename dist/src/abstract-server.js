"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("errorhandler");
const methodOverride = require("method-override");
const swaggerTools = require("swagger-tools");
const yaml = require("js-yaml");
const fs = require("fs");
const auth_1 = require("./middlewares/auth");
const API_UI_PATH = '/api-docs';
const API_DOCS = '/docs';
class AbstractServer {
    constructor() {
        this.config = this.getConfig();
        this.initApp();
        this.initDatabase();
        this.initAppConfig();
    }
    initApp() {
        this.app = express();
        this.router = express.Router();
    }
    initDatabase() {
        this.app.use((req, res, next) => {
            res.locals.connection = mysql.createConnection(this.config.db);
            res.locals.connection.connect();
            next();
        });
    }
    initAppConfig() {
        let swaggerDefinition = yaml.safeLoad(fs.readFileSync(this.config.swagger.yamlPath, 'utf8'));
        this.app.set('port', this.config.port);
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(cookieParser('SECRET_GOES_HERE'));
        this.app.use(methodOverride());
        this.app.use(this.config.swagger.protectedEndpoints.map(endpoint => this.config.swagger.apiBaseUrl + endpoint), auth_1.authenticate);
        this.app.use((err, req, res, next) => {
            err.status = 404;
            next(err);
        });
        this.app.use(errorHandler());
        swaggerTools.initializeMiddleware(swaggerDefinition, (middleware) => {
            this.app.use(middleware.swaggerMetadata());
            this.app.use(middleware.swaggerRouter({ useStubs: true, controllers: this.config.swagger.controllerPath }));
            this.app.use(middleware.swaggerUi({
                apiDocs: this.config.swagger.apiBaseUrl + API_DOCS,
                swaggerUi: this.config.swagger.apiBaseUrl + API_UI_PATH
            }));
        });
    }
}
exports.AbstractServer = AbstractServer;

//# sourceMappingURL=abstract-server.js.map
