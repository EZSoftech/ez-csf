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
import { AppSwaggerConfig } from './models/app-swagger-config';
import { authenticate } from './middlewares/auth';
import { pool } from './db/connection-pool';
import { AppError } from './models/app-error';
import * as cors from 'cors';

const API_UI_PATH = '/api-docs';
const API_DOCS = '/docs';
const DEFAULT_PORT = 3000;

export abstract class AbstractServer {
  app: Application;
  swaggerConfig: AppSwaggerConfig;

  public abstract getSwaggerConfig(): AppSwaggerConfig;

  constructor() {
    this.swaggerConfig = this.getSwaggerConfig();
    this.initApp();
    this.initDatabase();
  }

  initApp(): void {
    this.app = express();
    if (config.has('port')) {
      this.app.set('port', config.get('port') || DEFAULT_PORT);
    }
    this.initMiddlewares();
    this.initProtectEndpoints();
    this.initSwaggerTools();
  }

  initDatabase(): void {
    if (config.has('db')) {
      pool.initPools(config.get('db'));
    }
  }

  private initMiddlewares(): void {
    this.app.use(cors());
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    this.app.use(cookieParser('SECRET_GOES_HERE'));
    this.app.use(methodOverride());
  }

  private initSwaggerTools(): void {
    let swaggerDefinition = yaml.safeLoad(
      fs.readFileSync(this.swaggerConfig.yamlPath, 'utf8')
    );
    swaggerTools.initializeMiddleware(
      swaggerDefinition,
      (middleware: swaggerTools.Middleware20) => {
        this.app.use(middleware.swaggerMetadata());
        this.app.use(
          middleware.swaggerRouter({
            useStubs: true,
            controllers: this.swaggerConfig.controllerPath
          })
        );
        this.app.use(
          middleware.swaggerUi({
            apiDocs: this.swaggerConfig.apiBaseUrl + API_DOCS,
            swaggerUi: this.swaggerConfig.apiBaseUrl + API_UI_PATH
          })
        );
        this.app.use('/', (req: Request, res: Response) => {
          res.redirect(this.swaggerConfig.apiBaseUrl + API_UI_PATH);
        });
        this.app.use(
          (err: any, req: Request, res: Response, next: NextFunction) => {
            if (!err.status) {
              err.status = 500;
            }
            res.status(err.status).json(new AppError(err.status, err.message));
          }
        );
        this.app.use(errorHandler());
      }
    );
  }

  private initProtectEndpoints(): void {
    if (
      this.swaggerConfig.protectedEndpoints &&
      this.swaggerConfig.protectedEndpoints.length > 0
    ) {
      let endpoints = this.getAbsoluteEndpoints(
        this.swaggerConfig.apiBaseUrl,
        this.swaggerConfig.protectedEndpoints
      );
      this.app.all(endpoints, authenticate);
    }
  }

  private getAbsoluteEndpoints(
    apiBaseUrl: string,
    endpoints: Array<string>
  ): Array<string> {
    return endpoints.map(endpoint => {
      endpoint = apiBaseUrl + endpoint;
      return endpoint;
    });
  }
}
