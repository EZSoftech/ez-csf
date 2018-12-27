import { Response, NextFunction } from 'express';
import { AppUtil } from '../utils/auth-util';
import { ApiRequest } from '../models/api-request';

export function authenticate(req: ApiRequest, res: Response, next: NextFunction): void {
    AppUtil.verifyToken(req);
    next();
}
