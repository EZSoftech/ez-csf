"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const connection_pool_1 = require("./connection-pool");
const READ_DB = 'read';
const WRITE_DB = 'write';
class DbUtil {
    query(query, release) {
        return new Promise((resolve, reject) => {
            connection_pool_1.pool.getConnection(READ_DB).then((conn) => {
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
exports.dbo = dbo;

//# sourceMappingURL=db-util.js.map
