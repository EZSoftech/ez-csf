import { AbstractServer } from './abstract-server';

export class Server extends AbstractServer {

    public static bootstrap(): Server {
        return new Server();
    }

    getConfig(): any {
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
    }

}
