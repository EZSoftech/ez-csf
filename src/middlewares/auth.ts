import { Request, Response, NextFunction } from 'express';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    let authToken = req.header('authorization');
    if (authToken) {
        next();
    } else {
        res.sendStatus(401);
    }
}
