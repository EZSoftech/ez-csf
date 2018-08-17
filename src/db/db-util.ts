import * as Promise from 'bluebird';
import * as MySql from 'mysql';
import { pool } from './connection-pool';

const READ_DB = 'read';
const WRITE_DB = 'write';

class DbUtil {

    query(query: string, release: boolean): Promise<any> {
        return new Promise<any>((resolve: (result: any) => void, reject: (err: Error) => void) => {
            pool.getConnection(READ_DB).then((conn: MySql.PoolConnection) => {
                conn.query(query, (err, result, fields) => {
                    if (err) {
                        reject(err);
                    }
                    if (release) {
                        conn.release();
                    }
                    resolve(result);
                });
            }, err => {
                reject(err);
            });
        });
    }
}

let dbo = new DbUtil();

export { dbo };
