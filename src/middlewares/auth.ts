import { Request, Response, NextFunction } from 'express';
import { pool } from '../db/connection-pool';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    let authToken = req.header('authorization');
    if (authToken) {
        next();
    } else {
        res.sendStatus(401);
    }
}
