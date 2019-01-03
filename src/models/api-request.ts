import { Request } from 'express';
import { AppUser } from '@ezsoftech/common-objects';

export interface ApiRequest extends Request {
  authorizeUser: AppUser;
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
