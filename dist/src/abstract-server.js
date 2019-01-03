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
const app_error_1 = require("./models/app-error");
const cors = require("cors");
const API_UI_PATH = '/api-docs';
const API_DOCS = '/docs';
const DEFAULT_PORT = 3000;
class AbstractServer {
    constructor() {
        this.swaggerConfig = this.getSwaggerConfig();
        this.initApp();
        this.initDatabase();
    }
    initApp() {
        this.app = express();
        if (config.has('port')) {
            this.app.set('port', config.get('port') || DEFAULT_PORT);
        }
        this.initMiddlewares();
        this.initProtectEndpoints();
        this.initSwaggerTools();
    }
    initDatabase() {
        if (config.has('db')) {
            connection_pool_1.pool.initPools(config.get('db'));
        }
    }
    initMiddlewares() {
        this.app.use(cors());
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(cookieParser('SECRET_GOES_HERE'));
        this.app.use(methodOverride());
    }
    initSwaggerTools() {
        let swaggerDefinition = yaml.safeLoad(fs.readFileSync(this.swaggerConfig.yamlPath, 'utf8'));
        swaggerTools.initializeMiddleware(swaggerDefinition, (middleware) => {
            this.app.use(middleware.swaggerMetadata());
            this.app.use(middleware.swaggerRouter({
                useStubs: true,
                controllers: this.swaggerConfig.controllerPath
            }));
            this.app.use(middleware.swaggerUi({
                apiDocs: this.swaggerConfig.apiBaseUrl + API_DOCS,
                swaggerUi: this.swaggerConfig.apiBaseUrl + API_UI_PATH
            }));
            this.app.use('/', (req, res) => {
                res.redirect(this.swaggerConfig.apiBaseUrl + API_UI_PATH);
            });
            this.app.use((err, req, res, next) => {
                if (!err.status) {
                    err.status = 500;
                }
                res.status(err.status).json(new app_error_1.AppError(err.status, err.message));
            });
            this.app.use(errorHandler());
        });
    }
    initProtectEndpoints() {
        if (this.swaggerConfig.protectedEndpoints &&
            this.swaggerConfig.protectedEndpoints.length > 0) {
            let endpoints = this.getAbsoluteEndpoints(this.swaggerConfig.apiBaseUrl, this.swaggerConfig.protectedEndpoints);
            this.app.all(endpoints, auth_1.authenticate);
        }
    }
    getAbsoluteEndpoints(apiBaseUrl, endpoints) {
        return endpoints.map(endpoint => {
            endpoint = apiBaseUrl + endpoint;
            return endpoint;
        });
    }
}
exports.AbstractServer = AbstractServer;

//# sourceMappingURL=abstract-server.js.map
