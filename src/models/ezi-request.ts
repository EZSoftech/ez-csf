import { Request } from 'express';
import { EZIUserInfo } from './ezi-user-info';

export interface EZIRequest extends Request {
    authorizeUser: EZIUserInfo;
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
