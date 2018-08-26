"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config = require("config");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("errorhandler");
const methodOverride = require("method-override");
const swaggerTools = require("swagger-tools");
const yaml = require("js-yaml");
const fs = require("fs");
const auth_1 = require("./middlewares/auth");
const connection_pool_1 = require("./db/connection-pool");
const API_UI_PATH = '/api-docs';
const API_DOCS = '/docs';
const DEFAULT_PORT = 3000;
class AbstractServer {
    constructor() {
        this.swaggerConfig = this.getSwaggerConfig();
        this.initApp();
        this.initDatabase();
        this.initAppConfig();
    }
    initApp() {
        this.app = express();
        this.router = express.Router();
    }
    initDatabase() {
        if (config.has('db')) {
            connection_pool_1.pool.initPools(config.get('db'));
        }
    }
    initAppConfig() {
        let swaggerDefinition = yaml.safeLoad(fs.readFileSync(this.swaggerConfig.yamlPath, 'utf8'));
        if (config.has('port')) {
            this.app.set('port', config.get('port') || DEFAULT_PORT);
        }
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(cookieParser('SECRET_GOES_HERE'));
        this.app.use(methodOverride());
        this.app.use(this.swaggerConfig.protectedEndpoints.map(endpoint => this.swaggerConfig.apiBaseUrl + endpoint), auth_1.authenticate);
        this.app.use((err, req, res, next) => {
            err.status = 404;
            next(err);
        });
        this.app.use(errorHandler());
        swaggerTools.initializeMiddleware(swaggerDefinition, (middleware) => {
            this.app.use(middleware.swaggerMetadata());
            this.app.use(middleware.swaggerRouter({ useStubs: true, controllers: this.swaggerConfig.controllerPath }));
            this.app.use(middleware.swaggerUi({
                apiDocs: this.swaggerConfig.apiBaseUrl + API_DOCS,
                swaggerUi: this.swaggerConfig.apiBaseUrl + API_UI_PATH
            }));
            this.app.use('/', (req, res) => {
                res.redirect(this.swaggerConfig.apiBaseUrl + API_UI_PATH);
            });
        });
    }
}
exports.AbstractServer = AbstractServer;

//# sourceMappingURL=abstract-server.js.map
