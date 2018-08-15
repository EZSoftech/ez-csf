import { Swagger20Request as SwaggerRequest } from 'swagger-tools';
import { Response, NextFunction } from 'express';
import * as MySql from 'mysql';
import { pool } from '../db/connection-pool';

export function getNavigationLinks(req: SwaggerRequest<any>, res: Response, next: NextFunction): void {
    pool.getConnection('db').then((connection: MySql.PoolConnection) => {
        console.log(connection);
    });
    res.json({ success: true });
}
