import { Request, Response, NextFunction } from 'express';

const BEARER = 'Bearer '

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    let authorization = req.header('authorization');
    let authToken = authorization.split(BEARER)[1];
    if (authToken) {
        next();
    } else {
        res.json({
            message: 'Unauthorized'
        });
    }
}
