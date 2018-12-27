import { Request } from 'express';
import { AppUserInfo } from './app-user-info';

export interface ApiRequest extends Request {
    authorizeUser: AppUserInfo;
    swagger: {
        apiPath: string;
        path: any;
        operation: any;
        operationParameters: Array<any>;
        params: any;
        security: Array<any>;
        swaggerObject: any;
    };
}
