import { AbstractServer } from './abstract-server';
import * as path from 'path';
import { EZISwaggerConfig } from './models/ezi-swagger-config';

export class Server extends AbstractServer {

    public static bootstrap(): Server {
        return new Server();
    }

    getSwaggerConfig(): EZISwaggerConfig {
        return {
            apiBaseUrl: '/ez-csf/v1',
            yamlPath: path.resolve(__dirname, './api.yaml'),
            controllerPath: path.resolve(__dirname, './controllers'),
            protectedEndpoints: [
                '/get-user-info',
                '/users'
            ],
            corsEndpoints: []
        };
    }

}
