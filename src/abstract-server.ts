import * as express from 'express';
import * as config from 'config';
import { Application, Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as errorHandler from 'errorhandler';
import * as methodOverride from 'method-override';
import * as swaggerTools from 'swagger-tools';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { EZServerConfig } from './models/server-config';
import { authenticate } from './middlewares/auth';
import { Router } from 'express';
import { pool } from './db/connection-pool';

const API_UI_PATH = '/api-docs';
const API_DOCS = '/docs';

export abstract class AbstractServer {

    app: Application;
    router: Router;
    config: EZServerConfig;

    public abstract getConfig(): EZServerConfig;

    constructor() {
        this.config = this.getConfig();
        this.initApp();
        this.initDatabase();
        this.initAppConfig();
    }

    initApp(): void {
        this.app = express();
        this.router = express.Router();
    }

    initDatabase(): void {
        pool.initPools(this.config.db);
        let x = config.get('db');
    }

    initAppConfig(): void {
        let swaggerDefinition = yaml.safeLoad(fs.readFileSync(this.config.swagger.yamlPath, 'utf8'));
        this.app.set('port', this.config.port);
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(cookieParser('SECRET_GOES_HERE'));
        this.app.use(methodOverride());
        this.app.use(this.config.swagger.protectedEndpoints.map(endpoint => this.config.swagger.apiBaseUrl + endpoint), authenticate);
        this.app.use((err: any,
            req: Request,
            res: Response,
            next: NextFunction) => {
            err.status = 404;
            next(err);
        });
        this.app.use(errorHandler());
        swaggerTools.initializeMiddleware(swaggerDefinition, (middleware: swaggerTools.Middleware20) => {
            this.app.use(middleware.swaggerMetadata());
            this.app.use(middleware.swaggerRouter({ useStubs: true, controllers: this.config.swagger.controllerPath }));
            this.app.use(middleware.swaggerUi({
                apiDocs: this.config.swagger.apiBaseUrl + API_DOCS,
                swaggerUi: this.config.swagger.apiBaseUrl + API_UI_PATH
            }));
            this.app.use('/', (req: Request, res: Response) => {
                res.redirect(this.config.swagger.apiBaseUrl + API_UI_PATH);
            });
        });
    }

}
