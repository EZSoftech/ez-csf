import { Response, NextFunction } from 'express';
import { AppUtil } from '../utils/auth-util';
import { EZIRequest } from '../models/ezi-request';

export function authenticate(req: EZIRequest, res: Response, next: NextFunction): void {
    AppUtil.verifyToken(req);
    next();
}
