import { AbstractServer } from './abstract-server';
import * as path from 'path';
import { EZServerConfig } from './models/server-config';

export class Server extends AbstractServer {

    public static bootstrap(): Server {
        return new Server();
    }

    getConfig(): EZServerConfig {
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
                database: 'ez-insights'
            }
        };
    }

}
