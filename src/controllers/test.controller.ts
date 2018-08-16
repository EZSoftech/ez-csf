import { Swagger20Request as SwaggerRequest } from 'swagger-tools';
import { Response, NextFunction } from 'express';
import * as MySql from 'mysql';
import { pool } from '../db/connection-pool';

export function get(req: SwaggerRequest<any>, res: Response, next: NextFunction): void {
    pool.getConnection('db').then((conn: MySql.PoolConnection) => {
        conn.query('SELECT * FROM ezi_user', (err, result, fields) => {
            if (err) {
                next(err);
            }
            conn.release();
            res.json(result.map(item => {
                delete item.password;
                return item;
            }));
        });
    }, (err) => {
        next(err);
    });
}
