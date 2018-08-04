import * as config from 'config';
import * as express from 'express';
import { Application, Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as errorHandler from 'errorhandler';
import * as methodOverride from 'method-override';
import * as swaggerTools from 'swagger-tools';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

const API_UI_PATH = '/api-docs';
const API_DOCS = '/docs';

export abstract class AbstractServer {

    app: Application;
    port: number | undefined;
    swaggerConfig: any;

    constructor(config: any) {
        this.loadConfig();
        this.initApp();
        this.initAppConfig();
    }

    loadConfig(): void {
        this.swaggerConfig = config.get('swagger');
        this.port = config.get('port');
    }

    initApp(): void {
        this.app = express();
    }

    initAppConfig(): void {
        let yamlPath = path.resolve(__dirname, this.swaggerConfig.yamlPath);
        let swaggerDefinition = yaml.safeLoad(fs.readFileSync(yamlPath, 'utf8'));
        let controllerPath = path.resolve(__dirname, this.swaggerConfig.controllerPath);
        this.app.set('port', this.port);
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(cookieParser('SECRET_GOES_HERE'));
        this.app.use(methodOverride());
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
            this.app.use(middleware.swaggerRouter({ useStubs: true, controllers: controllerPath }));
            this.app.use(middleware.swaggerUi({
                apiDocs: this.swaggerConfig.apiBaseUrl + API_DOCS,
                swaggerUi: this.swaggerConfig.apiBaseUrl + API_UI_PATH
            }));
        });
    }

}
